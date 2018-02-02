
/**
 * @bit
 * @public
 * @name Sentences
 * @package randomiser
 * @namespace renoirb.lipsum
 * @description Handles a random sequence of words and sentences from text
 * @param {string=} text — A multi-line string of text, or no argument, defaults to Lorem Ipsum
 * @returns {Sentences}
 * @example
 * const m = new Sentences()
 * m.pickOne() // => ['Lorem Ipsum ...']
 * m.getSentences(2) // => ['Dolor sit amet ...', 'Foo bar bazz ...']
 */
class Sentences {
  constructor (text = null) {
    const sentences = text === null ? lorem : text
    this.sentences = sentences.split(`\n`).filter(n => n !== '')
    this.possibilities = this.sentences.length
    this.isFirstTime = true
  }
  pickOne () {
    return this.getSentences(1)
  }
  getSentences (n = 1) {
    const picks = []
    while (n-- && n > -1) {
      let i = 0
      if (this.isFirstTime === false) {
        i = Math.floor(Math.random() * (this.possibilities - 1)) + 1
      }
      picks.push(this.sentences[i])
    }
    this.isFirstTime = false
    return picks
  }
  getWords (n = 1) {
    const picks = []
    for (const sentence of this.pickOne()) {
      for (const word of sentence.split(' ')) {
        picks.push(word.shift())
      }
    }

    return picks
  }
}

const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Curabitur egestas odio a volutpat accumsan.
Nullam consectetur nibh pulvinar pellentesque eleifend.
Nam nec varius erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean tincidunt elit eu nunc sodales venenatis.
Donec dictum ornare dolor vel posuere.
Vivamus pellentesque, dui at malesuada interdum, lorem tortor hendrerit elit, eu consectetur risus tellus ut dolor. Integer nec tellus nisi. Sed pulvinar bibendum mauris et pulvinar. Vivamus sollicitudin elit sed iaculis cursus. Quisque vulputate tellus eros, eget tempus ex egestas id. Integer malesuada auctor pulvinar. Pellentesque et libero tellus.
Etiam efficitur risus sed commodo posuere. Etiam nisl lacus, pulvinar ac finibus non, vestibulum eu est. Pulvinar at eleifend vel, porttitor ac diam. Praesent vel laoreet enim.
Vestibulum consectetur justo sed nisi tempor, sed finibus erat feugiat.
Nulla risus magna, malesuada quis luctus et, lacinia vel metus.
Nullam quis pharetra sapien.
Morbi id eros venenatis tortor eleifend vestibulum quis ut massa.
Morbi bibendum lobortis turpis, vel auctor diam. Morbi massa massa, feugiat vitae pharetra non, ullamcorper quis mi.
Sed placerat sed nulla sit amet laoreet. Ut eros ex, bibendum vitae dapibus at, auctor a magna.
Nullam non ligula eget elit finibus tempus et sed ante. Nulla varius tellus nec varius tincidunt. Vivamus a velit vitae nibh porta vestibulum.
Vestibulum pharetra metus eget dui condimentum, nec ultricies erat ornare. Etiam porttitor turpis vel varius malesuada.
Maecenas luctus elit erat, ut dictum eros facilisis sed. Nunc aliquam orci nec gravida mattis. Etiam imperdiet maximus risus. Phasellus porta nisi ut mauris sollicitudin tincidunt.
Etiam sagittis tristique turpis lacinia efficitur. Sed molestie arcu quam, in dictum magna sodales sed. Quisque tempus turpis et tempus ultrices. Fusce non nunc dapibus, placerat dui ut, pellentesque eros. Quisque semper libero non dui rhoncus, sed iaculis nisi blandit. Morbi sodales, sem nec dignissim interdum, purus risus egestas velit, eget suscipit ipsum risus ac mauris. Ut dui elit, mollis et aliquet et, consequat et nunc. Etiam et ex non tellus blandit ullamcorper. Vivamus a mollis nulla.
Nulla egestas rutrum elit, at laoreet eros ornare ac. Vestibulum ultricies sed felis eu pharetra. Maecenas sollicitudin volutpat tellus ut varius.
Suspendisse finibus, erat sed pharetra rhoncus, dolor quam auctor libero, vitae mattis mi sapien sed nibh. Integer vehicula libero risus, non accumsan est congue ac. Ut felis purus, vestibulum in diam quis, lacinia sodales ipsum. Integer quis maximus purus. Donec eu quam vitae quam luctus faucibus. Duis iaculis nunc nec mauris dictum molestie. Suspendisse suscipit est erat, vitae suscipit mi ultricies a. Ut aliquet eget turpis vitae imperdiet. Maecenas nisl enim, rhoncus at lorem ultricies, elementum accumsan enim. Quisque ligula nunc, viverra vel tempor eget, consectetur ac elit.
`

export default Sentences
