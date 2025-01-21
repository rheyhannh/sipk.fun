// #region COMPONENT DEPEDENCY
import PageProvider from '@magiclink_page/provider';
import Container from '@magiclink_page/components/Container';
import Wrapper from '@magiclink_page/components/Wrapper';
import Content from '@magiclink_page/components/Content';
import ThemeChanger from '@magiclink_page/components/ThemeChanger';
// #endregion

// #region UTIL DEPEDENCY
import getFakta from '@/lib/supabase/cached/getFakta';
// #endregion

export default async function MagiclinkPage() {
	const fakta = await getFakta();

	return (
		<PageProvider>
			<Container>
				<Wrapper>
					<Content fakta={fakta} />
					<ThemeChanger />
				</Wrapper>
			</Container>
		</PageProvider>
	);
}
