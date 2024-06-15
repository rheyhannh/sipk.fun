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