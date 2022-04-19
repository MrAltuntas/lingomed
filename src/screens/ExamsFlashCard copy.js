import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'

const ExamsFlashCard = ({ route }) => {

    const { examId, examName, examsCategoryId, examsCategoryName } = route.params

    return (
        <>
            <Text>{examId} {examName}</Text>
            <Text>{examsCategoryId} {examsCategoryName}</Text>
        </>
    )
}


export default ExamsFlashCard