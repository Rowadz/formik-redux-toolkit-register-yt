import React from 'react'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { updateVal } from './slice'
import { FlexboxGrid, Button, Container, Input, Whisper, Tooltip } from 'rsuite'
import * as yup from 'yup'
import { useDebouncedCallback } from 'use-debounce'
import { debounce } from 'lodash'

const doWeHaveTheUser = (resolve, inputValue) => {
  fetch('http://jsonplaceholder.typicode.com/users')
    .then((res) => res.json())
    .then((data) => {
      const user = data.find(({ username }) => username === inputValue)
      return resolve(user ? false : true)
    })
}

const doWeHaveTheUserDebounced = debounce(doWeHaveTheUser, 250)

const schema = yup.object().shape({
  email: yup.string().email().required().nullable(false),
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .nullable(true)
    .required('Password Confirmation is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  username: yup
    .string()
    .test('username', 'We have this username', (inputValue) => {
      return new Promise((resolve) =>
        doWeHaveTheUserDebounced(resolve, inputValue)
      )
    }),
})

const selectEmail = (state) => state.register.email
const selectPassword = (state) => state.register.password

const Register = () => {
  const dispatch = useDispatch()
  const email = useSelector(selectEmail)
  const password = useSelector(selectPassword)
  const updateValFromStore = useDebouncedCallback((key, val) => {
    console.log({ key, val })
    dispatch(updateVal({ key, val }))
  }, 250)

  return (
    <Container style={{ height: '100vh', display: 'flex' }}>
      <FlexboxGrid align="middle" justify="center" style={{ height: '100%' }}>
        <Formik
          initialValues={{
            username: '',
            email: email,
            password: password,
            passwordConfirmation: '',
          }}
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isValid,
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Whisper
                  trigger="none"
                  open={errors.username && touched.username}
                  speaker={<Tooltip>{errors.username}</Tooltip>}
                >
                  <Input
                    size="lg"
                    type="text"
                    name="username"
                    placeholder="username"
                    style={{
                      borderColor:
                        errors.username && touched.username ? 'red' : 'inherit',
                      marginBottom: 20,
                    }}
                    onChange={(val, event) => {
                      handleChange(event)
                      updateValFromStore('username', val)
                    }}
                    onBlur={handleBlur}
                    value={values.username}
                  />
                </Whisper>
                <Whisper
                  trigger="none"
                  open={errors.email && touched.email}
                  speaker={<Tooltip>{errors.email}</Tooltip>}
                >
                  <Input
                    size="lg"
                    type="email"
                    name="email"
                    placeholder="email"
                    style={{
                      borderColor:
                        errors.email && touched.email ? 'red' : 'inherit',
                      marginBottom: 20,
                    }}
                    onChange={(val, event) => {
                      handleChange(event)
                      updateValFromStore('email', val)
                    }}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </Whisper>

                <Whisper
                  trigger="none"
                  open={errors.password && touched.password}
                  speaker={<Tooltip>{errors.password}</Tooltip>}
                >
                  <Input
                    size="lg"
                    type="password"
                    name="password"
                    placeholder="password"
                    style={{
                      borderColor:
                        errors.password && touched.password ? 'red' : 'inherit',
                      marginBottom: 20,
                    }}
                    onChange={(val, event) => {
                      handleChange(event)
                      updateValFromStore('password', val)
                    }}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </Whisper>
                <Whisper
                  trigger="none"
                  open={
                    errors.passwordConfirmation && touched.passwordConfirmation
                  }
                  speaker={
                    <Tooltip>
                      {errors.passwordConfirmation?.replace(
                        'passwordConfirmation',
                        'Password Confirmation'
                      )}
                    </Tooltip>
                  }
                >
                  <Input
                    size="lg"
                    type="password"
                    name="passwordConfirmation"
                    placeholder="Password Confirmation"
                    style={{
                      borderColor:
                        errors.passwordConfirmation &&
                        touched.passwordConfirmation
                          ? 'red'
                          : 'inherit',
                      marginBottom: 20,
                    }}
                    onChange={(val, event) => {
                      handleChange(event)
                      updateValFromStore('passwordConfirmation', val)
                    }}
                    onBlur={handleBlur}
                    value={values.passwordConfirmation}
                  />
                </Whisper>

                <Button type="submit" disabled={!isValid}>
                  Submit
                </Button>
              </form>
            )
          }}
        </Formik>
      </FlexboxGrid>
    </Container>
  )
}

export default Register
