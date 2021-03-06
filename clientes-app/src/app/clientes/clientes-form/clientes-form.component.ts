import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/clientes.service';
import { Cliente } from '../cliente';

@Component({
    selector: 'app-clientes-form',
    templateUrl: './clientes-form.component.html',
    styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {

    cliente: Cliente;
    success: boolean = false;
    errors?: String[];
    id?: Number;

    constructor(
        private service: ClientesService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.cliente = new Cliente();
    }

    ngOnInit(): void {
        this.getIdCliente();
        if (this.id) {
            this.service
                .getClienteById(this.id)
                .subscribe(
                    response => this.cliente = response,
                    errorResponse => this.cliente = new Cliente()
                );
        }

    }

    getIdCliente() {
        this.activatedRoute.params.subscribe(params =>{
            this.id = params['id']
        });
    }

    onSubmit() {
        if (this.isUpdate()){
            this.service
            .atualizar(this.cliente)
            .subscribe(response => {
                this.success = true;
                this.errors = [];
            }, errorResponse => {
                this.errors = ['Erro Ao Atualizar o cliente.'];
            })

        } else{
            this.service
                .salvar(this.cliente)
                .subscribe(response => {
                    this.reiniciarErros();
                    this.success = true;
                    this.cliente = response;
                }, errorResponse => {
                    this.reiniciarErros();
                    this.popularErrors(errorResponse);
                });

        }
    }

    isUpdate(): boolean{
        return this.id != undefined;
    }

    popularErrors(errorResponse: any) {
        this.success = false;
        for (var i = 0; i < errorResponse.error.errors!.length; i++) {
            this.errors!.push(errorResponse.error.errors[i].defaultMessage);
        }
    }

    reiniciarErros() {
        this.errors = [];
    }

    voltarParaListagem() {
        this.router.navigate(['/clientes/lista'])
    }
}
