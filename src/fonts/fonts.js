// #region NEXT DEPEDENCY
import { Poppins, League_Spartan } from 'next/font/google';
// #endregion

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--poppins-font',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const league_spartan = League_Spartan({
    subsets: ['latin'],
    display: 'swap',
    variable: '--leaguespartan-font',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export { poppins, league_spartan };