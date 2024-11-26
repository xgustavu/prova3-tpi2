class SoldadoModel{
    id: string = "";
    cim: number;
    altura: number;
    militar: string;

    constructor(cim: number, altura: number, militar: string){
        this.cim = cim;
        this.altura = altura;
        this.militar = militar;
    };
};

export default SoldadoModel;