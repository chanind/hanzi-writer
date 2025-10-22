# Hanzi Learner - Chinese Character Learning Website

A modern, interactive web application for learning Chinese characters with stroke order animations and practice quizzes.

## Features

- **Stroke Order Animations**: Watch animated demonstrations of how to write each character
- **Interactive Practice**: Test your knowledge with interactive stroke order quizzes
- **Character Browser**: Browse characters by HSK level (HSK 1-3)
- **Progress Tracking**: Monitor your learning progress with detailed statistics
- **Search Functionality**: Quickly find any character
- **Favorites**: Save your favorite characters for quick access
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Character Data**: Hanzi Writer library
- **Storage**: LocalStorage for progress tracking
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the website directory:
   ```bash
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deploying to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to complete the deployment

### Option 2: Vercel Dashboard

1. Push your code to a GitHub repository

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "New Project"

4. Import your GitHub repository

5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `website`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Click "Deploy"

Your website will be live in minutes!

## Project Structure

```
website/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   └── Navbar.jsx   # Navigation bar
│   ├── pages/           # Page components
│   │   ├── Home.jsx     # Home page
│   │   ├── Browse.jsx   # Character browser
│   │   ├── Learn.jsx    # Character learning page
│   │   ├── Practice.jsx # Practice quiz page
│   │   └── Progress.jsx # Progress tracking page
│   ├── data/            # Data files
│   │   └── hsk-characters.json  # HSK character data
│   ├── utils/           # Utility functions
│   │   └── storage.js   # LocalStorage utilities
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vercel.json          # Vercel configuration
```

## Features in Detail

### Home Page
- Search bar for quick character lookup
- Quick start with common characters
- Learning statistics dashboard
- Feature overview
- HSK level selector

### Browse Page
- Browse characters by HSK level (1-3)
- Visual indicators for learned characters
- Search/filter functionality
- Progress percentage display

### Learn Page
- Large character display with stroke order
- Animate full character or individual strokes
- Show/hide outline
- Mark as learned
- Add to favorites
- Direct link to practice quiz

### Practice Page
- Interactive stroke order quiz
- Real-time mistake tracking
- Hint system
- Score summary
- Option to practice specific characters or random selection

### Progress Page
- Overall statistics
- Learned characters grid
- Favorite characters
- Practice history
- Achievement tracking
- Data management options

## Data Storage

All learning progress is stored locally in your browser using LocalStorage:
- Learned characters
- Practice session history
- Quiz scores
- Favorite characters

No data is sent to any server - everything stays on your device!

## Customization

### Adding More Characters

Edit `src/data/hsk-characters.json` to add more HSK levels or characters:

```json
{
  "hsk1": ["你", "好", ...],
  "hsk2": [...],
  "hsk3": [...],
  "hsk4": [...]  // Add more levels
}
```

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This project is based on the [Hanzi Writer](https://github.com/chanind/hanzi-writer) library. Character data comes from [Hanzi Writer Data](https://github.com/chanind/hanzi-writer-data).

## License

This website application is part of the Hanzi Writer project and follows the same MIT license.

The character data is licensed under the Arphic Public License. See the main project README for more details.

## Acknowledgments

- [Hanzi Writer](https://github.com/chanind/hanzi-writer) - Amazing character animation library
- [Make me a Hanzi](https://github.com/skishore/makemeahanzi) - Source of character data
- [Arphic Technology](http://www.arphic.com/) - Original font data

## Support

For issues or questions:
- Check the [Hanzi Writer documentation](https://chanind.github.io/hanzi-writer)
- Open an issue on GitHub
- Review the main project README

## Future Enhancements

Potential features for future versions:
- [ ] More HSK levels (4-6)
- [ ] Traditional Chinese characters
- [ ] Audio pronunciation
- [ ] Character meanings and usage examples
- [ ] Spaced repetition system
- [ ] Study sets and custom lists
- [ ] Export/import learning data
- [ ] Dark mode
- [ ] Offline PWA support

---

Built with love for Chinese language learners
