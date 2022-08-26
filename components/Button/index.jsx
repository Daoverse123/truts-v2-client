import React from 'react'
import styles from './button.module.scss'

function PrimaryButton({ label, icon, onClick }) {
    return (
        <button className={styles.primary_button} onClick={onClick}>
            {(icon) && < span className={styles.btn_icon}>
                <img src={icon} alt="" />
            </span>}
            <span className={styles.btn_text}>
                {label}
            </span>
        </button >
    )
}

function SecondaryButton({ label, icon, onClick }) {
    return (
        <button className={styles.secondary_button} onClick={onClick}>
            {(icon) && < span className={styles.btn_icon}>
                <img src={icon} alt="" />
            </span>}
            <span className={styles.btn_text}>
                {label}
            </span>
        </button >
    )
}


export default function RenderButton(props) {
    let { type } = props
    switch (type) {
        case 'primary': {
            return (<PrimaryButton {...props} />)
            break;
        }

        case 'secondary': {
            return (<SecondaryButton {...props} />)
            break;
        }

        default: {
            return (<PrimaryButton {...props} />)
            break;
        }
    }
}

RenderButton.defaultProps = {
    type: 'primary',
    icon: null,
    label: 'Button',
    onClick: () => { }
}
