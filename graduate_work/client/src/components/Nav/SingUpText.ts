import { SignUpProps } from "../App/props.interface";


const SignUpText = {
    bg : {
        headerText: 'Регистрирай се',
        usernameLabel : 'Име',
        emailLabel : 'Имейл',
        passwordLabel : 'Парола',
        confirmPasswordLabel : 'Потвърди паролата',
        descriptionUsername: `Ние няма да споделим вашето име с други.`,
        descriptionEmail : `Ние няма да споделим вашия имейл с други.`,
        SingUpButtonText : 'Регистрирай се',
        notAMemberText : 'Вече сте регистрирани?',
        SignInLink : 'Влез в акаунта си',
        usernameErrorMsg: 'Невалиден формат на потребителското име. Трябва да е поне 3 символа и да не съдържа интервали.',
        emailErrorMsg: 'Невалиден формат на имейла. Моля, въведете валиден имейл адрес.',
        passwordErrorMsg: 'Невалиден формат на паролата. Трябва да е поне 5 символа и да не съдържа интервали.',
        confirmPasswordErrorMsg: 'Паролите не съвпадат. Моля, въведете същите пароли.',
        
    } as SignUpProps,
    en: {
        headerText: 'Sign up',
        usernameLabel : 'Username',
        emailLabel : 'Email',
        passwordLabel : 'Password',
        confirmPasswordLabel : 'Confirm password',
        descriptionUsername: `We'll never share your username with anyone else.`,
        descriptionEmail : `We'll never share your email with anyone else.`,
        SingUpButtonText : 'Sign up',
        notAMemberText : 'Already a member?',
        SignInLink : 'Login to your account',
        usernameErrorMsg: 'Invalid username format. Must be at least 3 characters and not contain spaces.',
        emailErrorMsg: 'Invalid email format. Please provide a valid email address.',
        passwordErrorMsg: 'Invalid password format. Must be at least 5 characters and not contain spaces.',
        confirmPasswordErrorMsg: 'Passwords do not match. Please make sure the passwords match.',
    } as SignUpProps,
};


export default SignUpText;