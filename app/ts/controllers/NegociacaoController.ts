import { NegociacoesView, MensagemView } from './../views/index';
import { Negociacoes,Negociacao, NegociacaoParcial } from './../models/index';
import { NegociacaoService } from './../services/index';
// import { domInject } from './../helpers/decorators/index';
import { throttle } from './../helpers/decorators/index';
import { imprime } from './../helpers/index';

export class NegociacaoController {

    // @domInject('#data')
    private _inputData: JQuery;

    // @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    // @domInject('#valor')
    private _inputValor: JQuery;

    private _negociacoes: Negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');
    private _negociacaoService = new NegociacaoService();

    constructor() {
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle(500)
    adiciona(event: Event) {

        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if (!this._ehDiaUtil(data)) {
            this._mensagemView.update('Somente Negociação em dias uteis, por favor!');
            return;
        }
        
        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()), 
            parseFloat(this._inputValor.val())
        );

        
        this._negociacoes.adiciona(negociacao);

        imprime(negociacao, this._negociacoes);
        
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');

    }

    private _ehDiaUtil(data: Date) {
        return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
    }

    // @throttle(500)
    // importaDados() {
      
    //     this._negociacaoService.obterNegociacoes(res => {
    //             if(res.ok) {
    //                 return res;
    //             } else {
    //                 throw new Error(res.statusText);
    //             }
    //         })
    //         .then(negociacoesParaImportar => {

    //             const negociacoesJaImportadas = this._negociacoes.paraArray();

    //             negociacoesParaImportar
    //                 .filter(
    //                     negociacao => 
    //                         !negociacoesJaImportadas
    //                             .some(jaImportado => negociacao.ehIgual(jaImportado))
    //                 )
    //             .forEach(negociacao => this._negociacoes.adiciona(negociacao))
    //             this._negociacoesView.update(this._negociacoes);
    //         })
    //         .catch(err => this._mensagemView.update(err.message));
    // }

    @throttle()
    async importaDados() {

        try {

            const negociacoesParaImportar = await this._negociacaoService
                .obterNegociacoes(res => {

                    if(res.ok) {
                        return res;
                    } else {
                        throw new Error(res.statusText);
                    }
                });

            const negociacoesJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter(negociacao => 
                    !negociacoesJaImportadas.some(jaImportada => 
                        negociacao.ehIgual(jaImportada)))
                .forEach(negociacao => 
                this._negociacoes.adiciona(negociacao));

            this._negociacoesView.update(this._negociacoes);

        } catch(err) {
            this._mensagemView.update(err.message);
        }
    }

}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}