// #region COMPONENTS DEPEDENCY
import HomeProvider from '@root_page/provider';
import Header from '@root_page/sections/header';
import Footer from '@root_page/sections/footer';
// #endregion

export default async function HomeLayout({ children }) {
	return (
		<HomeProvider>
			<Header />
			{children}
			<Footer />
		</HomeProvider>
	);
}
