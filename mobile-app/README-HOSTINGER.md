# Connecting Mobile App to Hostinger Website

## Configuration

1. **Update the Hostinger URL** in `src/config.js`:
   ```javascript
   export const HOSTINGER_URL = 'https://your-domain.com'; // Replace with your actual domain
   ```

2. **Design Screen** - The app now has a "Design Page" tab that loads your `design.html` page directly from Hostinger.

## How It Works

- The **Design Screen** includes a tab that loads your Hostinger design page
- All other tabs (Floorplanner, Planner 5D, SketchUp) work independently
- The app can navigate within your Hostinger domain for the design page

## Testing

1. Make sure your website is deployed to Hostinger
2. Update `src/config.js` with your domain URL
3. Run the app: `npm start`
4. Navigate to the Design screen and select "Design Page" tab
5. The app will load your Hostinger design page

## Notes

- The app works offline for most features
- The Design Page tab requires internet connection to load from Hostinger
- Other design tools (Planner 5D, etc.) work independently

