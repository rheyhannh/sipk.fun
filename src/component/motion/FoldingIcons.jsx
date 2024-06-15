// #region TYPE DEPEDENCY
import { HTMLProps, CSSProperties } from 'react';
// #endregion

// #region REACT DEPEDENCY
import { useState, useEffect } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/folding_icons.module.css'
// #endregion

/**
 * @typedef {Object} ContentEntry
 * Object yang merepresentasikan content
 * @property {JSX.Element | string} [icon]
 * Element icon atau teks content
 * - Default : `'Null'`
 * @property {string} [color]
 * Warna icon atau teks content
 * - Default : `'#262626'`
 * @property {string} [backgroundColor]
 * Warna background icon atau teks content
 * - Default : `'#ff6341'`
 */

/**
 * @typedef {Object} ContentStyleOptions
 * @property {string} [fontSize]
 * Ukuran icon atau teks content. 
 * Direkomendasikan untuk menggunakan `'rem'` based karna nilai ini secara default menentukan variabel lainnya sebagai berikut,
 * ```js
 * // Ukuran box container dan content ditentukan berdasarkan props 'contentOptions.fontSize'
 * const containerWidth = `calc(${fontSize} * 3.4)`;
 * const containerHeight = `calc(${fontSize} * 2.4)`;
 * const contentWidth = `calc(${fontSize} * 2.6)`;
 * const contentHeight = `calc(${fontSize} * 1.8)`;
 * // Customable dengan props 'containerStyleOptions' dan 'contentStyleOptions'
 * ```
 * - Default : `'5rem'`
 * @property {string} [width]
 * Width content
 * - Default : `'calc(${fontSize} * 2.6)'`
 * @property {string} [height]
 * Height content
 * - Default : `'calc(${fontSize} * 1.8)'`
 * @property {string} [borderRadius]
 * Border radius content
 * - Default : `'.25rem'`
 * @property {CSSProperties} custom
 * Custom content style. Secara default menggunakan style berikut,
 * ```style
 * display: grid;
 * place-content: center;
 * line-height: 1;
 * ```
 */

/**
 * @typedef {Object} ContainerStyleOptions
 * @property {string} [width]
 * Width container
 * - Default : `'calc(${contentOptions.fontSize} * 3.4)'`
 * @property {string} [height]
 * Height container
 * - Default : `'calc(${contentOptions.fontSize} * 2.4)'`
 * @property {string} [backgroundColor]
 * Background color container
 * - Default : `'#262626'`
 * @property {string} [borderColor]
 * Border color container
 * - Default : `'#404040'`
 * @property {string} [borderWidth]
 * Border width container
 * - Default : `'1px'`
 * @property {string} [borderStyle]
 * Border style container
 * - Default : `'solid'`
 * @property {string} [borderRadius]
 * Border radius container
 * - Default : `'0.5rem'`
 * @property {CSSProperties} custom
 * Custom container style. Secara default menggunakan style berikut,
 * ```style
 * position: relative;
 * z-index: 0;
 * transform: rotateY(-20deg);
 * transform-style: preserve-3d;
 * ```
 */

/** 
 * @typedef {Object} DividerStyleOptions
 * @property {string} [width]
 * Width divider
 * - Default : `'100%'`
 * @property {string} [height]
 * Height divider
 * - Default : `'1px'`
 * @property {string} [backgroundColor]
 * Background color divider
 * - Default : `'#262626'`
 * @property {CSSProperties} custom
 * Custom divider style. Secara default menggunakan style berikut,
 * ```style
 * position: absolute;
 * top: 50%;
 * transform: translateZ(1px);
 * ```
 */

/**
 * @typedef {Object} AnimationOptions
 * @property {'stateChanges' | 'repeat'} [type]
 * Timing animasi yang digunakan
 * - `'stateChanges'` : Animasi dimainkan saat state berubah. Opsi tambahan tipe ini dapat dilihat di props `stateChangesOptions`.
 * - `'repeat'` : Animasi dimainkan berulang saat component mount. Opsi tambahan tipe ini dapat dilihat di props `repeatOptions`.
 * - Default : `'stateChanges'`
 * @property {number} [duration]
 * Durasi animasi pergantian icon atau teks content
 * - Default : `0.5`
 * @property {(nextContent:number) => void} onStart
 * Callback saat animasi pergantian icon atau teks content mulai dengan parameter `nextContent` yang merupakan index contents yang akan aktif atau tampil
 * @property {(currentContent:number) => void} onComplete
 * Callback saat animasi pergantian icon atau teks content selesai dengan parameter `currentContent` yang merupakan index contents yang sedang aktif atau tampil
 */

/**
 * @typedef {Object} StateChangesOptions
 * @property {boolean} [useParentState]
 * Opsi untuk menggunakan state dari component lain atau tidak
 * - Default : `false`
 * @property {boolean} [parentStateValue]
 * State value dari component lain. Saat `true` animasi akan dimainkan untuk mengganti icon atau teks content
 * - Default : `false`
 * @property {(newParentStateValue:boolean) => void} parentStateSetter
 * State setter dari component lain
 * @property {boolean} [autoUpdateParentState]
 * Opsi untuk otomatis memperbarui parent state value dengan memanggil `parentStateSetter`
 * - Default : `false`
 */

/**
 * @typedef {Object} RepeatOptions
 * @property {number} [delay]
 * Delay dalam detik yang dihitung setelah mount
 * - Default : `5`
 * @property {number} [interval]
 * Interval perulangan animasi dalam detik
 * - Default : `5`
 */

/**
 * Box icon atau teks konten dengan animasi lipat. Konten diisi melalui props `contents`. Animasi dimainkan untuk mengganti konten ke index setelahnya `currentContent + 1`. 
 * 
 * Animasi dapat dimainkan secara berulang setelah component mount dengan tipe animasi `repeat` atau dikontrol dengan state dari parent dengan tipe animasi `stateChanges`. Contoh penggunaan sebagai berikut,
 * 
 * ```js
 * // 'repeat' //
 * const animationOptions = {type: 'repeat'}
 * const repeatOptions = {delay: 10, interval: 7.5}
 * 
 * <FoldingIcons animationOptions={animationOptions} repeatOptions={repeatOptions}/>
 * // Animasi akan dimainkan setelah 10 detik dari component mount, dan berulang setiap 7.5 detik
 * 
 * // 'stateChanges' //
 * const [animate, setAnimate] = useState(false);
 * const animationOptions = {type: 'stateChanges'}
 * const repeatOptions = {useParentState: true, parentStateValue: animate, parentStateSetter: setAnimate, autoUpdateParentState: true}
 * 
 * <FoldingIcons animationOptions={animationOptions} stateChangesOptions={stateChangesOptions}/>
 * // Animasi akan dimainkan saat animate true, setelah animasi selesai callback parentStateSetter akan dipanggil untuk update state
 * ```
 * @param {Object} props Component props
 * @param {Array<ContentEntry>} props.contents
 * Array dengan content entry. Default menggunakan array berikut,
 * ```js
 * const contents = [
 *  { icon: '0', color: '#ffffff', backgroundColor: '#0b3d91' },
 *  { icon: '1', color: '#000000', backgroundColor: '#ffcc00' },
 *  { icon: '2', color: '#ffffff', backgroundColor: '#d2691e' },
 *  { icon: '3', color: '#000000', backgroundColor: '#66cdaa' },
 *  { icon: '4', color: '#ffffff', backgroundColor: '#8b0000' },
 *  { icon: '5', color: '#000000', backgroundColor: '#088567' },
 * ]
 * ```
 * @param {ContentStyleOptions} props.contentOptions
 * Opsi style `content` yang dapat dirubah
 * @param {ContainerStyleOptions} props.containerOptions
 * Opsi style `container` yang dapat dirubah
 * @param {DividerStyleOptions} props.dividerOptions
 * Opsi style `divider` yang dapat dirubah
 * @param {HTMLProps} props.containerProps Props untuk container
 * @param {AnimationOptions} props.animationOptions
 * Pengaturan animasi yang digunakan
 * ```js
 * // Default animationOptions
 * const type = 'stateChanges';
 * const duration = 0.5;
 * const animationOptions = {type, duration}
 * ```
 * @param {StateChangesOptions} props.stateChangesOptions
 * Pengaturan animasi tipe `'stateChanges'`
 * ```js
 * // Default stateChangesOptions
 * const useParentState = false;
 * const parentStateValue = false;
 * const autoUpdateParentState = false;
 * const stateChangesOptions = {useParentState, parentStateSetter, autoUpdateParentState}
 * ```
 * @param {RepeatOptions} props.repeatOptions
 * Pengaturan animasi tipe `'repeatOptions'`
 * ```js
 * // Default repeatOptions
 * const delay = 5;
 * const interval = 5;
 * const repeatOptions = {delay, interval}
 * ```
 * @returns {JSX.Element} Rendered component
 */
const FoldingIcons = (
    {
        contents = [
            { icon: '0', color: '#ffffff', backgroundColor: '#0b3d91' },
            { icon: '1', color: '#000000', backgroundColor: '#ffcc00' },
            { icon: '2', color: '#ffffff', backgroundColor: '#d2691e' },
            { icon: '3', color: '#000000', backgroundColor: '#66cdaa' },
            { icon: '4', color: '#ffffff', backgroundColor: '#8b0000' },
            { icon: '5', color: '#000000', backgroundColor: '#088567' },
        ],
        contentOptions = {},
        containerOptions = {},
        dividerOptions = {},
        containerProps = {},
        animationOptions = {
            type: 'stateChanges',
            duration: 0.5,
        },
        stateChangesOptions = {
            useParentState: false,
            parentStateValue: false,
            autoUpdateParentState: false,
        },
        repeatOptions = {
            delay: 5,
            interval: 5,
        },
    }
) => {
    const [zIndexValue, setZIndexValue] = useState(1);
    const [currentContent, setCurrentContent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(animationOptions.type === 'stateChanges' ? stateChangesOptions.useParentState ? stateChangesOptions.parentStateValue ?? false : false : false);

    const size = contentOptions.fontSize ?? '5rem';
    const defaultContentsEntry = {
        icon: 'Null',
        color: '#262626',
        backgroundColor: '#ff6341'
    }
    const defaultStyles = {
        container: {
            width: `calc(${size} * 3.4)`,
            height: `calc(${size} * 2.4)`,
            // backgroundColor: containerOptions.backgroundColor ?? '#262626',
            // borderColor: containerOptions.borderColor ?? '#404040',
            // borderWidth: containerOptions.borderWidth ?? '1px',
            // borderStyle: containerOptions.borderStyle ?? 'solid',
            // borderRadius: containerOptions.borderRadius ?? '.5rem',
        },
        content: {
            width: `calc(${size} * 2.6)`,
            height: `calc(${size} * 1.8)`,
            fontSize: size,
        }
    }

    const handleOnAnimationStart = () => {
        // console.log('Animation Start');
        if (animationOptions.onStart) {
            animationOptions.onStart(currentContent + 1 >= contents.length ? 0 : currentContent + 1)
        }
    }

    const handleOnAnimationComplete = () => {
        // console.log('Animation Complete');
        setZIndexValue(value => value + 1);
        setCurrentContent(value => value + 1 >= contents.length ? 0 : value + 1);
        setIsAnimating(false);
        if (
            animationOptions.type === 'stateChanges' &&
            stateChangesOptions.autoUpdateParentState &&
            stateChangesOptions.parentStateSetter
        ) {
            stateChangesOptions.parentStateSetter(!isAnimating);
        }
        if (animationOptions.onComplete) {
            animationOptions.onComplete(currentContent + 1 >= contents.length ? 0 : currentContent + 1)
        }
    }

    const Container = ({ children, ...props }) => {
        return (
            <div
                className={styles.container}
                style={{
                    ...defaultStyles.container
                }}
                {...props}
            >
                {children}
            </div>
        )
    }

    const CurrentContent = () => (
        <div className={styles.current}>
            <motion.div
                style={{
                    zIndex: zIndexValue * -1
                }}
                initial={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%', rotateX: 0 }}
                animate={isAnimating ? { top: '50%', left: '50%', translateX: '-50%', translateY: '-50%', rotateX: -180, transition: { duration: animationOptions.duration ?? 0.5 } } : {}}
                onAnimationStart={handleOnAnimationStart}
            >
                <div
                    style={{
                        ...defaultStyles.content,
                        color: contents[currentContent].color ?? defaultContentsEntry.color,
                        backgroundColor: contents[currentContent].backgroundColor ?? defaultContentsEntry.backgroundColor
                    }}
                    className={styles.content}
                >
                    {contents[currentContent].icon ?? defaultContentsEntry.icon}
                </div>
            </motion.div>

            <div
                style={{
                    zIndex: zIndexValue
                }}
            >
                <div
                    style={{
                        ...defaultStyles.content,
                        color: contents[currentContent].color ?? defaultContentsEntry.color,
                        backgroundColor: contents[currentContent].backgroundColor ?? defaultContentsEntry.backgroundColor
                    }}
                    className={styles.content}
                >
                    {contents[currentContent].icon ?? defaultContentsEntry.icon}
                </div>
            </div>
        </div>
    )

    const NextContent = () => (
        <div className={styles.next}>
            <div
                style={{
                    zIndex: (zIndexValue + 1) * -1
                }}
            >
                <div
                    style={{
                        ...defaultStyles.content,
                        color: contents[currentContent + 1 >= contents.length ? 0 : currentContent + 1].color ?? defaultContentsEntry.color,
                        backgroundColor: contents[currentContent + 1 >= contents.length ? 0 : currentContent + 1].backgroundColor ?? defaultContentsEntry.backgroundColor
                    }}
                    className={styles.content}
                >
                    {contents[currentContent + 1 >= contents.length ? 0 : currentContent + 1].icon ?? defaultContentsEntry.icon}
                </div>
            </div>

            <motion.div
                style={{
                    zIndex: zIndexValue + 1
                }}
                initial={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%', rotateX: 180 }}
                animate={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%', rotateX: 0, transition: { duration: animationOptions.duration ?? 0.5 } }}
                onAnimationComplete={handleOnAnimationComplete}
            >
                <div
                    style={{
                        ...defaultStyles.content,
                        color: contents[currentContent + 1 >= contents.length ? 0 : currentContent + 1].color ?? defaultContentsEntry.color,
                        backgroundColor: contents[currentContent + 1 >= contents.length ? 0 : currentContent + 1].backgroundColor ?? defaultContentsEntry.backgroundColor
                    }}
                    className={styles.content}
                >
                    {contents[currentContent + 1 >= contents.length ? 0 : currentContent + 1].icon ?? defaultContentsEntry.icon}
                </div>
            </motion.div>
        </div>
    )

    const Divider = () => (
        <div
            className={styles.divider}
            style={{ zIndex: zIndexValue + 2 }}
        />
    )

    useEffect(() => {
        if (animationOptions.type !== 'repeat') { return; }
        // console.log('useEffect repeat');

        const startAnimation = () => {
            setIsAnimating(true)
            const intervalId = setInterval(() => {
                setIsAnimating(true);
            }, (repeatOptions.interval ?? 5) * 1000);

            return () => clearInterval(intervalId);
        };

        const timeoutId = setTimeout(startAnimation, (repeatOptions.delay ?? 5) * 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [animationOptions.type, repeatOptions.delay, repeatOptions.interval]);

    useEffect(() => {
        if (animationOptions.type !== 'stateChanges') { return; }
        // console.log('useEffect stateChanges');
        if (stateChangesOptions.useParentState) { setIsAnimating(stateChangesOptions.parentStateValue); }
    }, [animationOptions.type, stateChangesOptions.useParentState, stateChangesOptions.parentStateValue])

    return (
        <Container {...containerProps}>
            {
                isAnimating ?
                    <>
                        <CurrentContent />
                        <NextContent />
                    </> :
                    <CurrentContent />
            }

            <Divider />
        </Container>
    )
}

export default FoldingIcons;