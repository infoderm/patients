import isAppTest from './isAppTest';
import isNonAppTest from './isNonAppTest';

const isTest = () => isNonAppTest() || isAppTest();

export default isTest;
