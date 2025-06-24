const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  /**
   * Envoyer un email de bienvenue à un nouvel utilisateur
   */
  async envoyerEmailBienvenue(utilisateur) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@solidaire.com',
        to: utilisateur.email,
        subject: 'Bienvenue sur Solidaire !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2c3e50;">Bienvenue ${utilisateur.nom} !</h1>
            <p>Nous sommes ravis de vous accueillir sur notre plateforme Solidaire.</p>
            <p>Votre compte ${utilisateur.role} a été créé avec succès.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Prochaines étapes :</h3>
              <ul>
                <li>Complétez votre profil</li>
                ${utilisateur.role === 'hote' ? 
                  '<li>Créez votre première offre</li>' : 
                  '<li>Explorez les offres disponibles</li>'
                }
                <li>Rejoignez notre communauté solidaire</li>
              </ul>
            </div>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <p>L'équipe Solidaire</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email de bienvenue envoyé à ${utilisateur.email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    }
  }

  /**
   * Envoyer une notification de nouvelle réservation
   */
  async envoyerNotificationReservation(reservation, hote, etudiant) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@solidaire.com',
        to: hote.email,
        subject: 'Nouvelle réservation reçue !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2c3e50;">Nouvelle réservation !</h1>
            <p>Bonjour ${hote.nom},</p>
            <p>Vous avez reçu une nouvelle réservation de ${etudiant.nom}.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Détails de la réservation :</h3>
              <p><strong>Offre :</strong> ${reservation.offre.titre}</p>
              <p><strong>Prix convenu :</strong> ${reservation.prix_convenu}€</p>
              <p><strong>Statut :</strong> ${reservation.statut}</p>
            </div>
            <p>Connectez-vous à votre compte pour gérer cette réservation.</p>
            <p>L'équipe Solidaire</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Notification de réservation envoyée à ${hote.email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de réservation:', error);
    }
  }

  /**
   * Envoyer une confirmation de réservation
   */
  async envoyerConfirmationReservation(reservation, etudiant) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@solidaire.com',
        to: etudiant.email,
        subject: 'Confirmation de votre réservation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #27ae60;">Réservation confirmée !</h1>
            <p>Bonjour ${etudiant.nom},</p>
            <p>Votre réservation a été confirmée avec succès.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Détails de votre réservation :</h3>
              <p><strong>Offre :</strong> ${reservation.offre.titre}</p>
              <p><strong>Prix :</strong> ${reservation.prix_convenu}€</p>
              <p><strong>Localisation :</strong> ${reservation.offre.localisation}</p>
            </div>
            <p>Nous vous souhaitons un excellent moment !</p>
            <p>L'équipe Solidaire</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Confirmation de réservation envoyée à ${etudiant.email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la confirmation de réservation:', error);
    }
  }

  /**
   * Envoyer un rappel d'évaluation
   */
  async envoyerRappelEvaluation(reservation, utilisateur) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@solidaire.com',
        to: utilisateur.email,
        subject: 'N\'oubliez pas d\'évaluer votre expérience !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3498db;">Votre avis compte !</h1>
            <p>Bonjour ${utilisateur.nom},</p>
            <p>Nous espérons que votre expérience s'est bien déroulée.</p>
            <p>Prenez quelques minutes pour évaluer votre expérience et aider la communauté.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Réservation :</strong> ${reservation.offre.titre}</p>
            </div>
            <p>Votre avis est précieux pour maintenir la qualité de notre communauté.</p>
            <p>L'équipe Solidaire</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Rappel d'évaluation envoyé à ${utilisateur.email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du rappel d\'évaluation:', error);
    }
  }
}

module.exports = new EmailService();