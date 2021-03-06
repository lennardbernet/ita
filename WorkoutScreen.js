import React, {Component} from 'react';
import {Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DialogInput from "react-native-dialog-input";
import Dialog, {DialogButton, DialogContent, DialogFooter} from 'react-native-popup-dialog';
import * as firebase from "firebase";

export default class WorkoutScreen extends Component {
    static navigationOptions = {
        title: 'Workouts',
    };

    constructor() {
        super();
        this.state = {
            data: [],
            showAddBool: false,
            showDeleteBool: false,
            selectedItem: ""
        }
    }

    getWorkout = (url) => {
        fetch(url)
            .then(data => data.json())
            .then((data) => {
                this.setState({data: Object.keys(data)})
            })
    };

    addWorkout(inputText) {
        firebase.database().ref(inputText + '/exercises/Default Exercise').set({
            sets: '1/0/0/0'
        });
        let data = this.state.data;
        data.push(inputText);
        this.setState({data: data, showAddBool: false})
    }

    deleteWorkout = () => {
        let deleteRef = firebase.database().ref(this.state.selectedItem.toString());
        deleteRef.remove();
        let data = this.state.data;
        data.splice(data.indexOf(this.state.selectedItem));
        this.setState({data: data, showDeleteBool: false})
    };

    showAdd = (boolean) => {
        this.setState({showAddBool: boolean})
    };

    showDelete = (boolean) => {
        this.setState({showDeleteBool: boolean})
    };

    removeWorkout = (item) => {
        this.setState({showDeleteBool: true, selectedItem: item})
    };

    showWorkout = (item) => {
        const {navigate} = this.props.navigation;
        navigate('Exercise', {workout: item})
    };

    componentDidMount() {
        this.getWorkout('https://firsttry-66f87.firebaseio.com/.json')
    }

    render() {
        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    <Button title="Workout hinzufügen"
                            onPress={() => this.showAdd(true)}
                    />
                    <FlatList
                        data={this.state.data}
                        keyExtractor={item => item}
                        renderItem={({item}) =>
                            <TouchableOpacity
                                onPress={() => this.showWorkout(item)}
                                onLongPress={() => this.removeWorkout(item.toString())}>
                                <Text style={styles.item}>{item}</Text>
                            </TouchableOpacity>}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                    <DialogInput isDialogVisible={this.state.showAddBool}
                                 title={"Workout hinzufügen"}
                                 hintInput={"Workoutname"}
                                 submitInput={(inputText) => this.addWorkout(inputText)}
                                 closeDialog={() => {
                                     this.showAdd(false)
                                 }}>
                    </DialogInput>
                    <Dialog
                        visible={this.state.showDeleteBool}
                        footer={
                            <DialogFooter>
                                <DialogButton
                                    text="CANCEL"
                                    onPress={() => this.showDelete(false)}
                                />
                                <DialogButton
                                    text="OK"
                                    onPress={() => this.deleteWorkout()}
                                />
                            </DialogFooter>
                        }>
                        <DialogContent>
                            <Text>Wollen sie dieses Workout wirklich löschen?</Text>
                        </DialogContent>
                    </Dialog>
                </View>
            </ScrollView>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    };
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#d1d1cf',
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
