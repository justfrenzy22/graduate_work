import { SignInTextProps } from "../App/props.interface";


const SignInText = {
    bg : {
        headerText: 'Впиши се',
        inputLabel : 'Име или имейл',
        passwordLabel : 'Парола',
        descriptionUsr : `Ние няма да споделим вашия имейл с други.`,
        descriptionPwd : `Ние няма да споделим вашия парола с други.`,
        SignInButtonText : 'Влез',
        notAMemberText : 'Не сте регистрирани?',
        SignUpLink : 'Регистрирай се сега',
        emailErrorMsg: 'Невалиден формат на имейла или потребителското име. Трябва да е поне 3 символа и да не съдържа интервали.',
        passwordErrorMsg: 'Невалиден формат на паролата. Трябва да е поне 5 символа и да не съдържа интервали.',
        
    } as SignInTextProps,
    en: {
        headerText: 'Sign in',
        inputLabel : 'Username or email',
        passwordLabel : 'Password',
        descriptionUsr : `We'll never share your email with anyone else.`,
        descriptionPwd : `We'll never share your password with anyone else.`,
        SignInButtonText : 'Login',
        notAMemberText : 'Not a member?',
        SignUpLink : 'Sign up now',
        emailErrorMsg: 'Invalid username or email format. Must be at least 3 characters and not contain spaces.',
        passwordErrorMsg: 'Invalid password format. Must be at least 5 characters and not contain spaces.',
    } as SignInTextProps,
};


export default SignInText;