import Link from 'next/link';
import { LogoSipkFill } from '@/loader/StaticImages';
import styles from '@/app/not_found.module.css';

export const metadata = /** @type {import('next').Metadata} */ ({
	title: 'Not Found | SIPK'
});

export default function NotFound() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.image}>
					<LogoSipkFill priority={true} quality={100} />
				</div>
				<h1 className={styles.title}>
					404 <span>|</span> Not Found
				</h1>
				<p className={styles.description}>
					Kadang kita melangkah terlalu jauh, tapi setiap perjalanan membawa
					peluang untuk
				</p>
				<Link className={styles.link} href='/'>
					Kembali ke Rumah
				</Link>
			</div>
		</div>
	);
}
