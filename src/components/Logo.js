import * as React from 'react';
import { Image } from 'react-native';


const Logo = () => {
    return(
        <Image
          style={{ width: 114, height: 142, marginBottom: 20,marginTop: 55 }}
          source={require('../../assets/logo.png')}
        />
    )
}

export default Logo