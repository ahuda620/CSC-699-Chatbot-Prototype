import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBBtn
} from 'mdb-react-ui-kit';

const footerStyle = {
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  color: 'white',
  textAlign: 'center',
  padding: '10px 0',
};

export default function Footer() {
  return (
    <div>
    <MDBFooter className='text-center text-white blue  navbar-fixed-bottom ' style={footerStyle} >
      <MDBContainer className='p-4 pb-0'>
        <section className=''>
          <p className='d-flex justify-content-center align-items-center'>
            <span className='me-3'>Register for free</span>
            <MDBBtn type='button' outline color="light" rounded>
              Sign up!
            </MDBBtn>
          </p>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <span>© 2023 Copyright: </span> 
        <a className='text-white' href='/'>
            Job Portal
        </a>
      </div>
    </MDBFooter>
    </div>
  );
}