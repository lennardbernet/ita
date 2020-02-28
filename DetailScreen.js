import React, {Component} from "react";
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import * as firebase from 'firebase';

export default class DetailScreen extends Component {
    static navigationOptions = {
        title: 'Details',
    };

    constructor() {
        console.log(">>> DetailScreen/constructor");
        super();
        this.state = {
            workout: "",
            exercise: "",
            sets: [],
        }
    }

    getSets = (url) => {
        console.log(">>> DetailScreen/getSets");
        fetch(url)
            .then(data => data.json())
            .then((data) => {
                console.log("json found");
                let i = data.toString().substr(0, 1);
                let setData = data.toString().substring(2).split("/");
                let sets = [];
                for (let j = 0; j < i; j++) {
                    let set = [];
                    set.push(setData[j * 3]);
                    set.push(setData[(j * 3) + 1]);
                    set.push(setData[(j * 3) + 2]);
                    sets.push(set)
                }
                this.setState({sets: sets})
            })
    };

    saveSets() {
        console.log(">>> DetailScreen/saveSets");
        let params = this.props.navigation.getParam('exercise').toString().split("/");
        let sets = this.state.sets;
        let dbWert = "";
        dbWert += sets.length + "/";

        sets.forEach((s, i) => {
                dbWert += s[0] + "/" + s[1] + "/" + s[2] + "/"
            }
        );
        dbWert = dbWert.slice(0, -1);
        console.log("vor db zugriff")
        firebase.database().ref(this.state.workout + '/exercises/' + this.state.exercise).set({
            sets: dbWert
        });

    }

    deleteSet(index) {
        console.log(">>> DetailScreen/deleteSet");

        let sets = this.state.sets;
        sets.forEach((s, index2) => {
            if (index == index2) {
                sets.splice(index, 1)
            }
        });
        this.setState({sets: sets})
    }

    changeSets(text, index, column) {
        console.log("DetailScreen/changeSets");
        console.log(text + "/" + index + "/" + column);
        let sets = this.state.sets;
        sets[index][column] = text;
        this.setState({sets: sets});
        console.log(this.state.sets)
    }

    addSets() {
        console.log(">>> DetailScreen/addSets");
        console.log(this.state.sets);
        let sets = this.state.sets;
        let newSet = ['0', '0', '0'];
        sets.push(newSet);
        this.setState({sets: sets});
        console.log(this.state.sets)
    }

    createSets() {
        console.log(">>> DetailScreen/createSet");
        let sets = [];
        this.state.sets.forEach((s, index) => sets.push(
            <View key={index} style={{backgroundColor:'red',marginBottom:7,flexDirection: 'row',}}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text>Sets:</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.changeSets(text, index, 0)}
                        value={this.state.sets[index][0]}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text>Reps:</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.changeSets(text, index, 1)}
                        value={this.state.sets[index][1]}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text>Kg:</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.changeSets(text, index, 2)}
                        value={this.state.sets[index][2]}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button stlye={{}}
                            title="Löschen"
                            onPress={() => this.deleteSet(index)}
                    />
                </View>
            </View>
        ));
        return (sets)
    }

    componentDidMount() {
        console.log(">>> DetailScreen/componentDidMount");
        let params = this.props.navigation.getParam('exercise').toString().split("/");
        this.setState({workout: params[0], exercise: params[1]});
        this.getSets('https://firsttry-66f87.firebaseio.com/' + params[0] + '/exercises/' + params[1] + '/sets/.json');
    }

    render() {
        console.log(">>> DetailScreen/render");
        let text = this.props.navigation.getParam('exercise');
        return (
            <View style={{flex: 1, flexDirection: "column", alignItems: 'center', justifyContent: 'flex-start',width:'100%'}}>
                <View style={{backgroundColor: 'red'}}>
                    <Text>{this.state.workout}</Text>
                </View>
                <View style={{}}>
                    <Text>{this.state.exercise}</Text>
                </View>
                <View style={{}}>
                    {this.createSets()}
                </View>
                <Button style={styles.button}
                        title="Set hinzufügen"
                        onPress={() => this.addSets()}
                />
                <Button style={styles.button}
                        title="Speichern"
                        onPress={() => this.saveSets()}
                />
                <Button style={styles.button}
                        title="Zurück"
                        onPress={() => this.props.navigation.goBack()}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    textInput: {
        padding: 10,
        backgroundColor:'orange'
    },
    button:{
        margin:10,
        minWidth:300
    }
});