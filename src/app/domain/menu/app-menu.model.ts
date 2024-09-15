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

  public static readonly itemMenuCliente: AppMenuItem = {
    label: 'menu.cliente',
    icon: 'pi pi-fw pi-user-plus',
    routerLink: ['/cliente'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.CLIENTE_ADICIONAR]
  };

  public static readonly itemMenuProcedimento: AppMenuItem = {
    label: 'menu.procedimento',
    icon: 'pi pi-fw pi-th-large',
    routerLink: ['/procedimento'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.PROCEDIMENTO_LISTAR]
  };

  public static readonly itemMenuAquisicao: AppMenuItem = {
    label: 'menu.aquisicao',
    icon: 'pi pi-fw pi-plus',
    routerLink: ['/aquisicao'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.AQUISICAO_LISTAR]
  };

  public static readonly itemPreAgendamento: AppMenuItem = {
    label: 'menu.pre_agendamento',
    icon: 'pi pi-fw pi-calendar-plus',
    routerLink: ['/pre-agendamento'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.PRE_AGENDAMENTO_LISTAR]
  };

  public static readonly itemAgendamento: AppMenuItem = {
    label: 'menu.agendamento',
    icon: 'pi pi-fw pi-check-circle',
    routerLink: ['/agendamento'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.AGENDAMENTO_LISTAR]
  };

  public static readonly itemTermos: AppMenuItem = {
    label: 'menu.termos',
    icon: 'pi pi-fw pi-check-circle',
    routerLink: ['/termo'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.TERMOS_LISTAR]
  };

  public static readonly itemAtendimentos: AppMenuItem = {
    label: 'menu.atendimento',
    icon: 'pi pi-fw pi-check-circle',
    routerLink: ['/atendimento'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.ATENDIMENTO_LISTAR]
  };

  public static readonly itemMenuExemplo: AppMenuItem = {
    label: 'menu.exemplo',
    icon: 'pi pi-fw pi-file-edit',
    routerLink: ['/exemplo'],
    dontNeedPermission: false,
    permissions: [PermissionEnum.EXEMPLO]
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

  public static readonly menuCadastros: AppMenuItem = {
    label: 'menu.cadastros',
    icon: 'pi pi-fw pi-table',
    dontNeedPermission: true,
    items: [AppMenuModel.itemMenuCliente, AppMenuModel.itemMenuProcedimento, AppMenuModel.itemTermos]
  };

  public static readonly menu: AppMenuItem[] = [
    AppMenuModel.itemMenuAquisicao,
    AppMenuModel.itemPreAgendamento,
    AppMenuModel.itemAgendamento,
    AppMenuModel.itemAtendimentos,
    AppMenuModel.menuCadastros
  ];
}
