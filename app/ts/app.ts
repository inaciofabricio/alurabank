import { NegociacaoController } from './controllers/index';

const controller = new NegociacaoController();

$('.form').submit(controller.adiciona.bind(controller));
$('#botao-importa').click(controller.importaDados.bind(controller));