import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioService } from '../../../formulario.service';

@Component({
  selector: 'app-formulario-form',
  templateUrl: './formulario-form.component.html',
  styleUrls: ['./formulario-form.component.css'],
})
export class FormularioFormComponent implements OnInit {
  formularioGroup = this.fb.group({
    nome: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    dataCompra: ['', [Validators.required]],
    endereco: ['', [Validators.required]],
    comodo: ['', [Validators.required]],
    questoes: [[]],
  });

  questaoGroup = this.fb.group({
    dataInicio: ['', [Validators.required]],
    comodo: ['', [Validators.required]],
    dataFim: [''],
    destino: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    opcoes: [[]],
  });

  opcaoGroup = this.fb.group({
    dataInicio: [null, [Validators.required]],
    dataFim: [null, [Validators.required]],
    descricao: [null, [Validators.required]],
    destino: [null, [Validators.required]],
  });

  editando: boolean;

  constructor(
    public activeRouter: ActivatedRoute,
    public router: Router,
    public fb: FormBuilder,
    public formularioService: FormularioService
  ) {}

  ngOnInit() {
    this.editando = this.getRouterId() != 'novo';
    if (this.editando) {
      this.formularioService
        .obterFormularioPorId(this.getRouterId())
        .subscribe((formulario) => {
          this.formularioGroup.patchValue(formulario);
        });
    }
  }

  getRouterId() {
    return this.activeRouter.snapshot.params['id'];
  }

  salvar() {
    this.formularioService
      .salvarFormulario(this.formularioGroup.value)
      .subscribe((result) => {
        this.router.navigate(['/formulario']);
      });
  }

  atualizar() {
    this.formularioService
      .atualizarFormulario(this.formularioGroup.value)
      .subscribe((result) => {
        this.router.navigate(['/formulario']);
      });
  }

  addQuestao() {
    if (this.questaoGroup.valid) {
      this.formularioGroup.get('questoes').value.push(this.questaoGroup.value);
      this.questaoGroup.reset({ opcoes: [] });
    }
  }

  addOpcao() {
    this.questaoGroup.get('opcoes').value.push(this.opcaoGroup.value);
    this.opcaoGroup.reset();
  }
}
