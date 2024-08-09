import { Form, redirect, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  //formData is not a react router related function 
  //it is a js api
  // formData is available in the request property 
  const formData = await request.formData();
  // console.log(formData)
  //fromEntries turns array of arrays into an object 
  const data = Object.fromEntries(formData);
  // console.log(data)

  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration successful');
    return redirect('/login');
  } catch (error) {
    toast.error(error?.response?.data?.msg);

    return error;
  }
};
//form element allows the use of action 

const Register = () => {
  return (
    <Wrapper>
      <Form method='post' className='form'>
        {/* <Logo /> */}
        <h4>Register</h4>
        <FormRow type='text' name='name' />
        <FormRow type='text' name='lastName' labelText='last name' />
        <FormRow type='text' name='location' />
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />
        <SubmitBtn />
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Register;
