import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VariousContentService {
  //framecoordinate from top left to bottom right
  private frameCoordinates = [
    {
      x: 33,
      y: 32,
      title: 'Contact',
    },
    {
      x: 161,
      y: 32,
      title: '',
    },
    {
      x: 289,
      y: 32,
      title: 'compétances diverses',
    },
    {
      x: 33,
      y: 160,
      title: 'mobilité',
    },
    {
      x: 161,
      y: 160,
      title: 'passion et intérêt',
    },
    {
      x: 289,
      y: 160,
      title: 'langues',
    },
  ];

  createBox(scene: Phaser.Scene, scaleOfTheGame: number): void {
    const textStyle = {
      fontFamily: 'Pixelify_Sans',
      fontSize: 4 * scaleOfTheGame,
      color: '#000000',
    };
    const boldTextStyle = {
      fontFamily: 'PixelifySans-Bold',
      fontSize: 5 * scaleOfTheGame,
      color: '#000000',
    };

    //creation of titles
    this.frameCoordinates.forEach((section, sectionIndex) => {
      const y = this.frameCoordinates[sectionIndex].y * scaleOfTheGame;
      const x = this.frameCoordinates[sectionIndex].x * scaleOfTheGame;

      if (section.title) {
        scene.add.rectangle(
          x + (39.6 * scaleOfTheGame), // Position x du rectangle
          y + (12.4 * scaleOfTheGame), // Position y du rectangle
          62 * scaleOfTheGame, // Largeur du rectangle
          8 * scaleOfTheGame, // Hauteur du rectangle (20 pixels est la hauteur estimée du texte)
          0xffffff // Couleur blanche
        );

        scene.add.text(
          x + 10 * scaleOfTheGame,
          y + 10 * scaleOfTheGame,
          section.title,
          boldTextStyle
        );
      }
    });

    //----------------box1
    let boxNumber = 0;

    const phone = scene.add.image(
      this.frameCoordinates[boxNumber].x*scaleOfTheGame + 10*scaleOfTheGame,
      this.frameCoordinates[boxNumber].y*scaleOfTheGame + 20*scaleOfTheGame,
      'phone'
    );
    phone.setOrigin(0, 0); 
    phone.displayHeight = 12.5 * scaleOfTheGame; 
    phone.scaleX = phone.scaleY;

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 25 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 25 * scaleOfTheGame,
      '06 26 93 22 20',
      textStyle
    );

    const mail = scene.add.image(
      this.frameCoordinates[boxNumber].x*scaleOfTheGame + 10*scaleOfTheGame,
      this.frameCoordinates[boxNumber].y*scaleOfTheGame + 35*scaleOfTheGame,
      'mail'
    );
    mail.setOrigin(0, 0); 
    mail.displayHeight = 8.75 * scaleOfTheGame; 
    mail.scaleX = mail.scaleY;

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 25 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 35 * scaleOfTheGame,
      'quentin.verscheure',
      textStyle
    );
    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 25 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 40 * scaleOfTheGame,
      '@gmail.com',
      textStyle
    );

    //----------------box3
    boxNumber = 2;

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 10 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 20 * scaleOfTheGame,
      '- formation et consulting',
      textStyle
    );

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 10 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 25 * scaleOfTheGame,
      '- dessin technique du',
      textStyle
    );

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 13 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 30 * scaleOfTheGame,
      'batiment (BIM)',
      textStyle
    );

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 10 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 35 * scaleOfTheGame,
      '- modelisation 3D',
      textStyle
    );

    //----------------box4 -- mobility
    boxNumber = 3;

    const mobility = scene.add.image(
      this.frameCoordinates[boxNumber].x*scaleOfTheGame + 10*scaleOfTheGame,
      this.frameCoordinates[boxNumber].y*scaleOfTheGame + 20*scaleOfTheGame,
      'mobility'
    );
    mobility.setOrigin(0, 0); 
    mobility.displayHeight = 25 * scaleOfTheGame; 
    mobility.scaleX = mobility.scaleY;

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 15 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 50 * scaleOfTheGame,
      'Permit B',
      textStyle
    );
    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 15 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 55 * scaleOfTheGame,
      'Non véhiculé',
      textStyle
    );
    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 15 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 60 * scaleOfTheGame,
      'mobilité: Nantes',
      textStyle
    );

    //----------------box5 - passion et intérêt
    boxNumber = 4;

    const computer = scene.add.image(
      this.frameCoordinates[boxNumber].x*scaleOfTheGame + 59*scaleOfTheGame,
      this.frameCoordinates[boxNumber].y*scaleOfTheGame + 17*scaleOfTheGame,
      'computer'
    );
    computer.setOrigin(0, 0); 
    computer.displayHeight = 17.5 * scaleOfTheGame; 
    computer.scaleX = computer.scaleY;

    const threeD = scene.add.image(
      this.frameCoordinates[boxNumber].x*scaleOfTheGame + 15*scaleOfTheGame,
      this.frameCoordinates[boxNumber].y*scaleOfTheGame + 50*scaleOfTheGame,
      '3d'
    );
    threeD.setOrigin(0, 0); 
    threeD.displayHeight = 12.5 * scaleOfTheGame; 
    threeD.scaleX = threeD.scaleY;

    const science = scene.add.image(
      this.frameCoordinates[boxNumber].x*scaleOfTheGame + 35*scaleOfTheGame,
      this.frameCoordinates[boxNumber].y*scaleOfTheGame + 50*scaleOfTheGame,
      'science'
    );
    science.setOrigin(0, 0); 
    science.displayHeight = 20 * scaleOfTheGame; 
    science.scaleX = science.scaleY;

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 10 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 20 * scaleOfTheGame,
      'decouverte et création',
      textStyle
    );

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 10 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 25 * scaleOfTheGame,
      'informatique',
      textStyle
    );

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 10 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 30 * scaleOfTheGame,
      'jeux video et e-sport',
      textStyle
    );

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 10 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 35 * scaleOfTheGame,
      'modelisation et impression 3d',
      textStyle
    );

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 10 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 40 * scaleOfTheGame,
      'bande dessinée',
      textStyle
    );

    //----------------box6 -- langues
    boxNumber = 5;

    const frenchFlag = scene.add.image(
      this.frameCoordinates[boxNumber].x*scaleOfTheGame + 10*scaleOfTheGame,
      this.frameCoordinates[boxNumber].y*scaleOfTheGame + 20*scaleOfTheGame,
      'french_flag'
    );
    frenchFlag.setOrigin(0, 0); 
    frenchFlag.displayHeight = 10 * scaleOfTheGame; 
    frenchFlag.scaleX = frenchFlag.scaleY;

    const englishFlag = scene.add.image(
      this.frameCoordinates[boxNumber].x*scaleOfTheGame + 10*scaleOfTheGame,
      this.frameCoordinates[boxNumber].y*scaleOfTheGame + 35*scaleOfTheGame,
      'english_flag'
    );
    englishFlag.setOrigin(0, 0); 
    englishFlag.displayHeight = 10 * scaleOfTheGame; 
    englishFlag.scaleX = frenchFlag.scaleY;

    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 27 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 22 * scaleOfTheGame,
      'Langue natale',
      textStyle
    );
    scene.add.text(
      this.frameCoordinates[boxNumber].x * scaleOfTheGame + 27 * scaleOfTheGame,
      this.frameCoordinates[boxNumber].y * scaleOfTheGame + 38 * scaleOfTheGame,
      'niveau B1+',
      textStyle
    );
  }
}
