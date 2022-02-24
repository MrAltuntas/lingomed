import * as React from 'react';
import { StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LinearGradientS=()=>{
    return(
        <LinearGradient start={{ x: 0.5, y: 1 }} and end={{ x: 0.5, y: 0 }} colors={['#085DAB', '#C5EBFE']} style={styles.background} />
    )
}
const styles = StyleSheet.create({
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 200,
    },
  });

export default LinearGradientS