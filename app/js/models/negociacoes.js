class Negociacoes {
    constructor() {
        this._negociacoes = [];
    }
    // private _negociacoes: Negociacao[] = [];
    adiciona(negociacao) {
        this._negociacoes.push(negociacao);
    }
    paraArray() {
        return [].concat(this._negociacoes);
    }
}
