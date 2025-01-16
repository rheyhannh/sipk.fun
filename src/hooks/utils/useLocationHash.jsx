const useLocationHash = () => {
    const [isClient, setIsClient] = React.useState(false);
    const [hash, setHash] = React.useState(getHash());
    const params = useParams();

    React.useEffect(() => {
        setIsClient(true);
        setHash(getHash());
    }, [params]);

    return isClient ? hash : '';
}

export default useLocationHash;