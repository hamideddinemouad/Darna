class Twofaservice {
    public generateCode(){
        const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
        return randomSixDigit;
    }

}
export default Twofaservice;