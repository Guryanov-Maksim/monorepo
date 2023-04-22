import { memo, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { Paper } from '../../components/Paper'
import { Footer } from '../../components/Footer'
import { Button, Container, Input, PasswordInput, Link as UILink } from '@memebattle/ui'
import { t } from '../../utils/i18n'
import type { AuthRoutes } from '../../types/authRoutes'
import type { RegisterFormSubmissionErrors, RegisterFormValues } from './RegisterPage.types'
import { Header } from '../../components/Header'
import { useRegisterValidation } from './useRegisterValidation'
import { useCasServices } from '../../modules/cas-services'
import { useNavigate } from 'react-router'

interface RegisterPageProps {
  authRoutes: AuthRoutes
}

export const RegisterPage = memo<RegisterPageProps>(({ authRoutes }) => {
  const { signUpService } = useCasServices()

  const navigate = useNavigate()

  const initialValues = useMemo<RegisterFormValues>(
    () => ({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }),
    [],
  )

  const handleSubmit = useCallback(
    async (values: RegisterFormValues): Promise<RegisterFormSubmissionErrors | undefined> => {
      try {
        if (!values.username || !values.password || !values.password || !values.email) {
          return
        }
        const answer = await signUpService({ username: values.username, email: values.email, password: values.password })

        if (answer.success) {
          const query = new URLSearchParams({ username: values.username, email: values.email })

          navigate(`${authRoutes.CONFIRM_EMAIL}?${query.toString()}`)
          return
        }

        if (answer.error.errorCode === 422) {
          return { username: t.register.userAlreadyExistsError, email: t.register.userAlreadyExistsError }
        }
      } catch (e) {
        return { [FORM_ERROR]: 'Something went wrong' }
      }
    },
    [navigate, signUpService, authRoutes],
  )

  const validate = useRegisterValidation()

  return (
    <Container component="main" maxWidth="xs">
      <Header />
      <Form<RegisterFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
        render={({ handleSubmit, submitError }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Paper>
              <Field
                name="username"
                render={({ input, meta }) => (
                  <Input
                    {...input}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label={t.register.username}
                    name="username"
                    autoComplete="username"
                    autoFocus
                    error={!!(meta.error && meta.dirty) || (meta.submitFailed && !meta.dirtySinceLastSubmit)}
                    helperText={meta.error || meta.submitError}
                  />
                )}
              />
              <Field
                name="email"
                render={({ input, meta }) => (
                  <Input
                    {...input}
                    variant="outlined"
                    type="email"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t.register.email}
                    name="email"
                    autoComplete="email"
                    error={!!(meta.error && meta.dirty) || (meta.submitFailed && !meta.dirtySinceLastSubmit)}
                    helperText={meta.error || meta.submitError}
                  />
                )}
              />
              <Field
                name="password"
                render={({ input, meta }) => (
                  <PasswordInput
                    {...input}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t.login.password}
                    id="password"
                    autoComplete="current-password"
                    error={!!(meta.error && meta.dirty) || !!meta.submitError}
                    helperText={meta.error || meta.submitError}
                  />
                )}
              />
              <Field
                name="confirmPassword"
                render={({ input, meta }) => (
                  <PasswordInput
                    {...input}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label={t.register.confirmPassword}
                    id="confirmPassword"
                    error={!!(meta.error && meta.dirty) || meta.submitError}
                    helperText={meta.error}
                  />
                )}
              />
              {submitError}
              <br />
              <Button type="submit" fullWidth variant="contained" color="primary" size="large">
                {t.register.submit}
              </Button>
              <br />
              <UILink underline="always" component={Link} to={authRoutes.LOGIN}>
                {t.register.linkToLogin}
              </UILink>
            </Paper>
          </form>
        )}
      />
      <Footer />
    </Container>
  )
})
