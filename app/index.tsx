import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: "#f5f5f5",
        paddingTop: 50,

        // justifyContent: "center",
        // alignItems: "center",
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',

    },

    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },

    addButton: {
        backgroundColor: '#007bFF',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center'
    },

    addButtonText: {
        color: 'white',
        fontWeight: 'bold',

    },

    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },

    taskText: {
        fontSize: 16
    },

    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 5,
    },

    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }


})

export default function TodoList() {


    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState<{ id: number; value: string }[]>([]);

    // 读取待办事项
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const storedTasks = await AsyncStorage.getItem('tasks');
                if (storedTasks){
                    setTasks(JSON.parse(storedTasks));
                }
            } catch (err) {
                console.error("加载失败:",err);
            }
        }
        loadTasks();
    },[]);

    // 每次任务列表更新时保存
    useEffect(() => {
        const saveTasks = async () => {
            try {
                await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            } catch (err) {
                console.error("保存失败:",err);
            }
        };
        saveTasks();
    },[tasks]);

    const addTask = () => {
        if (task.trim()) {
            setTasks([...tasks, { id: Math.random(), value: task }]);
            setTask('');
        }
    };

    const deleteTask = (taskId: number) => {
        setTasks(tasks.filter((task) => { return task.id !== taskId }));
    }



    return (
        <>
            <Stack.Screen options={{ title: "待办列表" }} />
            <View
                style={styles.container}
            >
                <Text style={styles.title}>Todo List</Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={task} onChangeText={setTask} placeholder="输入任务"></TextInput>
                    <TouchableOpacity style={styles.addButton} onPress={addTask}>
                        <Text style={styles.addButtonText}>新增</Text>
                    </TouchableOpacity>
                </View>
                <FlatList data={tasks} renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.taskText}>{item.value}</Text>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
                            <Text style={styles.deleteButtonText}>删除</Text>
                        </TouchableOpacity>
                    </View>
                )}
                    keyExtractor={(item) => item.id.toString()}
                >
                </FlatList>




            </View>
        </>
    );
}
