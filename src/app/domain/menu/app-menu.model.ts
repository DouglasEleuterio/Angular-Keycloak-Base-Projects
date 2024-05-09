import { PermissionEnum } from '../permission/permission.enum';

export class AppMenuItem {
  label?: string;
  icon?: string;
  routerLink?: string[];
  items?: AppMenuItem[];
  dontNeedPermission?;
  permissions?: Array<string>;
  showChildren?: boolean;
  noTranslate?: boolean;
  disabled?: boolean;
  badgeClass?: string;
  url?: string;
  target?: string;
  class?: string;

  separator?: boolean;

  badge?: string;
  preventExact?: boolean;
  isLabel?: boolean;
}

export class AppMenuModel {
  public static readonly itemMenuHome: AppMenuItem = {
    label: 'menu.home',
    icon: 'pi pi-fw pi-home',
    routerLink: ['/'],
    dontNeedPermission: true
  };

  public static readonly itemMenuUploadXML: AppMenuItem = {
    label: 'menu.upload',
    icon: 'pi pi-fw pi-file-import',
    routerLink: ['/upload'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.UPLOAD_ADICIONAR]
  };

  public static readonly itemMenuExemplo: AppMenuItem = {
    label: 'menu.exemplo',
    icon: 'pi pi-fw pi-file-edit',
    routerLink: ['/exemplo'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.EXEMPLO]
  };

  public static readonly itemMenuTipoLocalidade: AppMenuItem = {
    label: 'menu.tipo_localidade',
    icon: 'pi pi-fw pi-map-marker',
    routerLink: ['/tipo-localidade'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly itemMenuJustificativa: AppMenuItem = {
    label: 'menu.justificativa',
    icon: 'pi pi-fw pi-file-edit',
    routerLink: ['/justificativa'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly itemMenuValorDiaria: AppMenuItem = {
    label: 'menu.valor_diaria',
    icon: 'pi pi-fw pi-dollar',
    routerLink: ['/valor-diaria'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };
  public static readonly itemMenuClassificacaoLocalidade: AppMenuItem = {
    label: 'menu.classificacao_localidade',
    icon: 'pi pi-fw pi-map-marker',
    routerLink: ['/classificacao-localidade'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly itemMenuAuxilioAlimentacao: AppMenuItem = {
    label: 'menu.auxilio_alimentacao',
    icon: 'pi pi-fw pi-shopping-bag',
    routerLink: ['/auxilio-alimentacao'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly itemMenuLocalDificilAcesso: AppMenuItem = {
    label: 'menu.local_dificil_acesso',
    icon: 'pi pi-fw pi-map-marker',
    routerLink: ['/local-dificil-acesso'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly menuSubmenu: AppMenuItem = {
    label: 'menu.exemplo_submenu',
    icon: 'pi pi-fw pi-box',
    dontNeedPermission: true,
    items: [AppMenuModel.itemMenuExemplo]
  };

  public static readonly itemMenuEvento: AppMenuItem = {
    label: 'menu.evento',
    icon: 'pi pi-fw pi-globe',
    routerLink: ['/evento'],
    dontNeedPermission: true
  };

  public static readonly itemMenuSolicitacao: AppMenuItem = {
    label: 'menu.solicitacao',
    icon: 'pi pi-fw pi-sitemap',
    routerLink: ['/solicitacao'],
    dontNeedPermission: true
  };

  public static readonly itemMenuTipoEvento: AppMenuItem = {
    label: 'menu.tipo_evento',
    icon: 'pi pi-fw pi-file-edit',
    routerLink: ['/tipo-evento'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly itemMenuCompanhiaAerea: AppMenuItem = {
    label: 'menu.companhia-aerea',
    icon: 'pi pi-fw pi-file-edit',
    routerLink: ['/companhia-aerea'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly itemMenuPrecoCombustivel: AppMenuItem = {
    label: 'menu.preco_combustivel',
    icon: 'pi pi-fw pi-file-edit',
    routerLink: ['/preco-combustivel'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly itemMenuPoliticaIndenizacaoTransporte: AppMenuItem = {
    label: 'menu.indenizacao_transporte',
    icon: 'pi pi-fw pi-file-edit',
    routerLink: ['/indenizacao-transporte'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly itemMenuDistanciaLocalidade: AppMenuItem = {
    label: 'menu.distancia-localidade',
    icon: 'pi pi-fw pi-file-edit',
    routerLink: ['/distancia-localidade'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ADMINISTRADOR]
  };

  public static readonly menuTabelas: AppMenuItem = {
    label: 'menu.tabelas_submenu',
    icon: 'pi pi-fw pi-table',
    dontNeedPermission: true,
    items: [
      AppMenuModel.itemMenuTipoLocalidade,
      AppMenuModel.itemMenuClassificacaoLocalidade,
      AppMenuModel.itemMenuTipoEvento,
      AppMenuModel.itemMenuAuxilioAlimentacao,
      AppMenuModel.itemMenuJustificativa,
      AppMenuModel.itemMenuValorDiaria,
      AppMenuModel.itemMenuLocalDificilAcesso,
      AppMenuModel.itemMenuPrecoCombustivel,
      AppMenuModel.itemMenuCompanhiaAerea,
      AppMenuModel.itemMenuPoliticaIndenizacaoTransporte,
      AppMenuModel.itemMenuDistanciaLocalidade
    ]
  };

  public static readonly menu: AppMenuItem[] = [
    AppMenuModel.itemMenuExemplo,
    AppMenuModel.itemMenuUploadXML,
    AppMenuModel.itemMenuHome,
    AppMenuModel.menuTabelas,
    AppMenuModel.itemMenuEvento,
    AppMenuModel.itemMenuSolicitacao
  ];
}
