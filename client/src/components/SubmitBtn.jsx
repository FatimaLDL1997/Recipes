import { useNavigation } from 'react-router-dom';
const SubmitBtn = ({ formBtn }) => {
  const navigation = useNavigation();
  // console.log(navigation); to check when its idle or submitting
  
  const isSubmitting = navigation.state === 'submitting';
  return (
    <button
      type='submit'
      className={`btn btn-block ${formBtn && 'form-btn'} `}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'submitting' : 'submit'}
    </button>
  );
};
export default SubmitBtn;
