const countBasedLength = (ln) => {
    if (ln == 1) {
        return `${1.5}px`;
    }
    if (ln == 2) {
        return `-${6 * 0.4}px`;
    }
    if (ln == 3) {
        return `-${6 * 0.5}px`;
    }
    if (ln > 6) {
        return `-${6 * 4.5}px`;
    } else {
        return `-${ln * 4.5}px`;
    }
};

export default countBasedLength