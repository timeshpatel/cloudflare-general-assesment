addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

let profilePicture = "https://avatars0.githubusercontent.com/u/32861309?s=400&u=abcf89f9d0fc115fafcb8e9e7a84c9b741c5f81d&v=4"

let socialLinks = [
  {"icon": "https://simpleicons.org/icons/linkedin.svg", "url": "https://www.linkedin.com/in/timesh-patel/"},
  {"icon": "https://simpleicons.org/icons/github.svg", "url": "https://github.com/timeshpatel"}
]

async function handleRequest(request) {
  
  let links = [
    { "name": "Porfolio", "url": "https://timeshpatel.github.io/"}, 
    { "name": "LinkedIn", "url": "https://www.linkedin.com/in/timesh-patel/"}, 
    { "name": "My Favorite Sports Team", "url": "https://www.manutd.com/"},
    { "name": "Cloudflare", "url": "https://www.cloudflare.com/"}
  ]

  console.log(links)

  let response 

  console.log(request.url);
  var strsplit = request.url.split("/")

  if(request.url.includes("/links")){
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'application/json'},
    })
  }
  else{
    response = await fetch("https://static-links-page.signalnerve.workers.dev", {headers: { 'content-type': 'application/json'}})
    return new HTMLRewriter()
      .on("div#links", new LinksTransformer(links))
      .on("div#social", new SocialTransformer(socialLinks))
      .on("div#social", new SocialHandler())
      .on("div#profile", new ProfileHandler())
      .on("img#avatar", new ProfilePhotoHandler())
      .on("h1#name", new NameHandler())
      .on("title", new TitleHandler())
      .on("body", new BodyHandler())
      .transform(response)
  }
}

class ProfileHandler{
  element (profileElement) {
    profileElement.removeAttribute("style")
  }
}

class ProfilePhotoHandler{
  element (ProfilePhotoElement) {
    ProfilePhotoElement.setAttribute("src", profilePicture)
  }
}

class NameHandler{
  element (NameElement) {
    NameElement.setInnerContent("Timesh Patel")
  }
}

class TitleHandler{
  element (TitleElement) {
    TitleElement.setInnerContent("Timesh Patel")
  }
}

class BodyHandler{
  element (BodyElement) {
    BodyElement.setAttribute("style", "background-color: #ED8936")
  }
}

class SocialHandler{
  element (socialElement) {
    socialElement.removeAttribute("style")
  }
}

class SocialTransformer {
  constructor(socialLinks) {
    this.socialLinks = socialLinks
}
  async element(element) {
    this.socialLinks.forEach(socialLink => {
        element.append(`<a href="${socialLink.url}"> <img src="${socialLink.icon}"/></a>`, { html : true});
    })
  }
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    this.links.forEach(link => {
      element.append(`<a href="${link.url}">${link.name}</a>`, {html: true})
    });
  }
}
