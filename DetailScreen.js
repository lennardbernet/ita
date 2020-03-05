import React, {Component} from "react";
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import * as firebase from 'firebase';

export default class DetailScreen extends Component {
    static navigationOptions = {
        title: 'Details',
    };

    constructor() {
        super();
        this.state = {
            workout: "",
            exercise: "",
            sets: []
        }
    }

    getSets = (url) => {
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
        let sets = this.state.sets;
        let dbValue = "";
        dbValue += sets.length + "/";
        sets.forEach((s) => {
                dbValue += s[0] + "/" + s[1] + "/" + s[2] + "/"
            }
        );
        dbValue = dbValue.slice(0, -1);
        firebase.database().ref(this.state.workout + '/exercises/' + this.state.exercise).set({
            sets: dbValue
        });
    }

    deleteSet(index) {
        let sets = this.state.sets;
        sets.forEach((s, index2) => {
            if (index === index2) {
                sets.splice(index, 1)
            }
        });
        this.setState({sets: sets})
    }

    changeSets(text, index, column) {
        let sets = this.state.sets;
        sets[index][column] = text;
        this.setState({sets: sets});
    }

    addSets() {
        let sets = this.state.sets;
        let newSet = ['0', '0', '0'];
        sets.push(newSet);
        this.setState({sets: sets});
    }

    createSets() {
        let sets = [];
        this.state.sets.forEach((s, index) => sets.push(
            <View key={index}
                  style={{maxWidth: '100%', marginBottom: 7, flexDirection: 'row',}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text>Sets:</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.changeSets(text, index, 0)}
                        value={this.state.sets[index][0]}
                        keyboardType={'numeric'}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text>Reps:</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.changeSets(text, index, 1)}
                        value={this.state.sets[index][1]}
                        keyboardType={'numeric'}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text>Kg:</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.changeSets(text, index, 2)}
                        value={this.state.sets[index][2]}
                        keyboardType={'numeric'}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Button title="Löschen"
                            onPress={() => this.deleteSet(index)}
                    />
                </View>
            </View>
        ));
        return (sets)
    }

    componentDidMount() {
        let params = this.props.navigation.getParam('exercise').toString().split("/");
        this.setState({workout: params[0], exercise: params[1]});
        this.getSets('https://firsttry-66f87.firebaseio.com/' + params[0] + '/exercises/' + params[1] + '/sets/.json');
    }

    render() {
        return (
            <ScrollView>
                <View style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%'
                }}>
                    <View style={{margin: 15}}>
                        <Text style={{
                            fontSize: 25,
                            fontWeight: 'bold'
                        }}>
                            {this.state.workout.toString().toUpperCase()}
                        </Text>
                    </View>
                    <View style={{marginBottom: 15}}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold'
                            }}>
                            {this.state.exercise}
                        </Text>
                    </View>
                    <View>
                        {this.createSets()}
                    </View>
                    <View style={{width: '100%', padding: 20}}>
                        <Button title="Set hinzufügen"
                                onPress={() => this.addSets()}
                        />
                        <Text> </Text>
                        <Button title="Speichern"
                                onPress={() => this.saveSets()}
                        />
                        <Text> </Text>
                        <Button title="Zurück"
                                onPress={() => this.props.navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    textInput: {
        padding: 5,
        margin: 5,
        backgroundColor: '#d1d1cf'
    },
    button: {marginTop: 20}
});