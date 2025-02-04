import { v4 as uuid } from 'uuid'

let inventory = [
  {
    categories: ['new arrivals'], name: 'Timber Gray Sofa 2.0', price: '1000', image: '/products/couch1.png', description: 'Stay a while. The Timber charme chocolat sofa is set atop an oak trim and flaunts fluffy leather back and seat cushions. Over time, this brown leather sofa’s full-aniline upholstery will develop a worn-in vintage look. Snuggle up with your cutie (animal or human) and dive into a bowl of popcorn. This sofa is really hard to leave. Natural color variations, wrinkles and creases are part of the unique characteristics of this leather. It will develop a relaxed vintage look with regular use.', brand: 'Jason Bourne', currentInventory: 4 },
  {
    categories: ['sofas', 'living room'], name: 'Carmel Brown Sofa', price: '1000', image: '/products/couch5.png', description: 'Stay a while. The Timber charme chocolat sofa is set atop an oak trim and flaunts fluffy leather back and seat cushions. Over time, this brown leather sofa’s full-aniline upholstery will develop a worn-in vintage look. Snuggle up with your cutie (animal or human) and dive into a bowl of popcorn. This sofa is really hard to leave. Natural color variations, wrinkles and creases are part of the unique characteristics of this leather. It will develop a relaxed vintage look with regular use.' , brand: 'Jason Bourne' , currentInventory: 2 },
  {
    categories: ['new arrivals', 'sofas'], name: 'Mod Leather Sofa', price: '800', image: '/products/couch6.png', description: 'Easy to love. The Sven in birch ivory looks cozy and refined, like a sweater that a fancy lady wears on a coastal vacation. This ivory loveseat has a tufted bench seat, loose back pillows and bolsters, solid walnut legs, and is ready to make your apartment the adult oasis you dream of. Nestle it with plants, an ottoman, an accent chair, or 8 dogs. Your call.', brand: 'Jason Bourne', currentInventory: 8 },
  {
    categories: ['new arrivals', 'sofas'], name: 'Thetis Gray Love Seat', price: '900', image: '/products/couch7.png', description: 'You know your dad’s incredible vintage bomber jacket? The Nirvana dakota tan leather sofa is that jacket, but in couch form. With super-plush down-filled cushions, a corner-blocked wooden frame, and a leather patina that only gets better with age, the Nirvana will have you looking cool and feeling peaceful every time you take a seat. Looks pretty great with a sheepskin throw, if we may say so. With use, this leather will become softer and more wrinkled and the cushions will take on a lived-in look, like your favorite leather jacket.' , brand: 'Jason Bourne', currentInventory: 10},
]

inventory.map(i => {
  i.id = uuid()
  return i
})

export default inventory