
const randomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 92%, 64%)`;
}

export default randomColor;