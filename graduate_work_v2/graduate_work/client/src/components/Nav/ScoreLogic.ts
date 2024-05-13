import { AppContextTypes } from "../../utils/AppContext";

export const ScoreLogic = (score: number, lang: AppContextTypes['defaultLanguage']) => {
    let label: string;
    let value: number;
    let nextLevelScore: number;

    switch (true) {
        case (score >= 25000):
            label = lang === 'en-US' ? 'Cinematics Grandmaster' : 'Грандмастер на киното';
            value = 0;
            nextLevelScore = 25000;
            break;
        case (score >= 10000):
            label = lang === 'en-US' ? 'Films Master' : 'Майстор на филмите';
            nextLevelScore = 25000;
            break;
        case (score >= 7500):
            label = lang === 'en-US' ? 'Movie Buff' : 'Кино маниак';
            nextLevelScore = 10000;
            break;
        case (score >= 5000):
            label = lang === 'en-US' ? 'Screen Enthusiast' : 'Екранен ентусиаст';
            nextLevelScore = 7500;
            break;
        case (score >= 2500):
            label = lang === 'en-US' ? 'Movie Enthusiast' : 'Любител на филми';
            nextLevelScore = 5000;
            break;
        case (score >= 1000):
            label = lang === 'en-US' ? 'Binge Watcher' : 'Маратонец';
            nextLevelScore = 2500;
            break;
        case (score >= 500):
            label = lang === 'en-US' ? 'Channel Surfer' : 'Телевизионен сърфист';
            nextLevelScore = 1000;
            break;
        case (score >= 250):
            label = lang === 'en-US' ? 'Regular Viewer' : 'Редовен зрител';
            nextLevelScore = 500;
            break;
        default:
            label = lang === 'en-US' ? 'Casual Watcher' : 'Случаен наблюдател';
            nextLevelScore = 250;
            break;
    }
    if (score >= nextLevelScore) {
        value = 100;
    }
    else if (score === 0) {
        value = 0;
    } else {
        value = score / (nextLevelScore / 100);
    }
    return {
        label : label,
        value: value
    };
};