import ReactLoading from 'react-loading';
 
const Spinner = ({ type = "balls", color =  "#1a1a1a"}) => (
    <ReactLoading type={type} color={color} height={'80%'} width={'800px'} />
);
 
export default Spinner;