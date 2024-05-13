const HeaderText = {
  bg: {
    welcomeText: 'Добре дошли в CrackFlix!',
    firstParagraph: 'Вашият безплатен портал за стрийминг на филми и сериали!',
    secondParagraph: 'Насладете се на любимите си съдържания без каквито и да е било разходи.',
    thirdParagraph: 'Започнете гледането сега!',
    inputPlaceholder: 'Търси',
    filterBtnTxt: 'Филтър'
  } as HeaderTextTypes,
  en: {
    welcomeText: 'Welcome to CrackFlix!',
    firstParagraph: 'Your free streaming portal for movies and tv series!',
    secondParagraph: 'Enjoy your favorite content without any restrictions.',
    thirdParagraph: 'Start watching now!',
    inputPlaceholder: 'Search',
    filterBtnTxt: 'Filter'
  } as HeaderTextTypes
};

type HeaderTextTypes = {
  welcomeText: string,
  firstParagraph: string,
  secondParagraph: string,
  thirdParagraph: string,
  inputPlaceholder: string,
  filterBtnTxt: string
}


export default HeaderText;
