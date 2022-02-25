import * as React from 'react';
import { StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LinearGradientS=({startPlace, endPlace, height})=>{
    return(
        <LinearGradient start={{ x: 0.5, y: startPlace }} and end={{ x: 0.5, y: endPlace }} colors={['#085DAB', '#C5EBFE']} style={[styles.background, {height: height}]} />
    )
}
const styles = StyleSheet.create({
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

export default LinearGradientS