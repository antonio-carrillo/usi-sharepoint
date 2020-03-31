export const environment = {
  production: true,
  sharepoint: {
    prefix: null
  },
  sources: [
    {
      fields: ['Title'],
      label: 'Noticia',
      listName: 'Noticias',
      rediretUrl: '/SitePages/Web Parts/Portada.aspx'
    }
  ]
};
