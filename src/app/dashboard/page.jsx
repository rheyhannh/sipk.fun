import { Summary } from '@/component/Card'
import styles from './home.module.css'

export default function DashboardPage() {
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <Summary
                        state='loaded'
                        color='var(--primary-color)'
                        icon={{name: 'TbSum', lib: 'tb'}}
                        data={{value: 144, percentage: 85, lastUpdated: 'Terakhir Diupdate'}}
                        title={'SKS'}
                    >
                    </Summary>
                    <Summary
                        state='loaded'
                        color='var(--danger-color)'
                        icon={{name: 'FiBookOpen', lib: 'fi'}}
                        data={{value: 42, percentage: 32, lastUpdated: 'Terakhir Diupdate'}}
                        title={'Matakuliah'}
                    >
                    </Summary>
                    <Summary
                        state='loaded'
                        color='var(--success-color)'
                        icon={{name: 'FiBookOpen', lib: 'fi'}}
                        data={{value: 3.75, percentage: 90, lastUpdated: 'Terakhir Diupdate'}}
                        title={'IPK'}
                    >
                    </Summary>
                    <Summary
                        state='loaded'
                        color='aqua'
                        icon={{name: 'LiaWeightSolid', lib: 'lia'}}
                        data={{value: 65, percentage: 55, lastUpdated: 'Terakhir Diupdate'}}
                        title={'Berat Badan'}
                    >
                    </Summary>
                    <Summary
                        state='loaded'
                        color='violet'
                        icon={{name: 'LiaPeopleCarrySolid', lib: 'lia'}}
                        data={{value: 175, percentage: 69, lastUpdated: 'Terakhir Diupdate'}}
                        title={'Tinggi Badan'}
                    >
                    </Summary>
                    <Summary
                        state='loaded'
                        color='var(--first-color)'
                        icon={{name: 'MdPeopleOutline', lib: 'md'}}
                        data={{value: 24, percentage: 32, lastUpdated: 'Terakhir Diupdate'}}
                        title={'Umur'}
                    >
                    </Summary>
                    <Summary
                        state='loaded'
                        color='gold'
                        icon={{name: 'GiRank3', lib: 'gi'}}
                        data={{value: 24, percentage: 83, lastUpdated: 'Terakhir Diupdate'}}
                        title={'Umur'}
                    >
                    </Summary>
                    <Summary
                        state='loading'
                    >
                    </Summary>
                    <Summary
                        state='error'
                    >
                    </Summary>

                </div>
                <div>
                    <h1>Dashboard Content 2</h1>
                </div>
            </div>
        </>
    )
}