import React from 'react';
import Stick from '../../containers/Stick/Stick';
import Buttons from '../../containers/Buttons/Buttons';


const BUTTONS_DIVIDER_SLOPE = 2;

const wonderPad = () => (
    <React.Fragment>
        <Stick/>
        <Buttons dividerSlope = {BUTTONS_DIVIDER_SLOPE}/>
    </React.Fragment>
);

export default wonderPad;