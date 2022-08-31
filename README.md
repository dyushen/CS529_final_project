# Alveolus Analysis - Web Application User Guide

This README contains a user guide for the Alveolus Analysis web application. It also includes instructions for installing the software, processing your own image data set, and running the tool locally.

We provide a Web Demonstration of the system which includes data for two pre-processed experiments. This demonstration may be found at the link below:

### [Link to Web Demonstration of System](https://dyushen.github.io/CS529_final_project/)

---

---

## Setting up locally for your own use

This section will describe the steps to download the code of the project to your machine, pre-process your own data, and load it into the application

### Cloning the repository

You can download the code for this project by cloning the repository to your machine:

```console
git clone https://github.com/dyushen/CS529_final_project.git
```

### Data Preprocessing

```console
python preprocess.py ...
```

#### Tuning Processing Hyperparameters

| Name                                      | Abbreviation.    | Shorthand | Feature Processing Stage (**extraction** or **filtering**) | Recommended Initial Value | Description |
| ----------------------------------------- | ---------------- | --------- | ---------------------------------------------------------- | ------------------------- | ----------- |
| Denoising Filter Strength (Alveoli)       | `--h_alv`        | `-h`      | extraction | 35 | removes noise from images but can also remove image details if set too high |
| Template Size (Alveoli)                   | `--tws_alv`      | `-t`      | extraction | 7  | must be odd number; area to calculate denoising operation, so a smaller value will focus on eliminating fine noise |
| Search Size (Alveoli)                     | `--sws_alv`      | `-s`      | extraction | 21 | must be odd number; area to calculate averaging operation, so a smaller value will only use very close regions of image to fill in noise |
| Blur Kernel Size                          | `--gbks`         | `-g`      | extraction | 11 | must be odd number; area to blur image to further eliminate holes/edges caused by noise (recommended starting value = 11) |
| Threshold                                 | `--thresh`       | `-r`      | extraction | 5  | limit pixel intensity to keep in image, effectively eliminates noisy pixels leftover by the denoising and blurring operations |
| Min Area                                  | `--min_area`     | `-a`      | extraction | 15 | minimum area a detected region must have in order to be maintained as a detected feature (**highly dependent on quality of videos**) |
| Denoising Filter Strength _(Neutrophil)_  | `--h_neut`       | `-e`      | extraction | 45 | removes noise from images but can also remove image details if set too high |
| Template Size _(Neutrophil)_              | `--tws_neut`     | `-w`      | extraction | 7  | must be odd number; area to calculate denoising operation, so a smaller value will focus on eliminating fine noise |
| Search Size _(Neutrophil)_                | `--sws_neut`     | `-n`      | extraction | 21 | must be odd number; area to calculate averaging operation, so a smaller value will only use very close regions of image to fill in noise
| Dilate Kernel Size _(Neutrophil)_         | `--dks`          | `-d`      | extraction | 4  | slightly expands detected neutrophil pixels to more accurately represent actual neutrophil areas
| Feature Filter Window                     | `--ff_window`    | `-o`      | filtering  | 1  | how many frames features must persist across (unidirectional) in both size and location
| Filter Location Sensitivity               | `--ff_loc_sens`  | `-l`      | filtering  | 10 | how close feature centers should be in neighboring frames to be counted as the same, note that the unit here is pixels
| Filter Size Sensitivity                   | `--ff_size_sens` | `-z`      | filtering  | 20 | how close feature areas should be in neighboring frames to be counted as the same, note that the unit here is (approximately) square pixels


### Setting Up Your Application



---

## Libraries and Tools

Libraries Used for the implementation of the web application:

- d3.js ([LICENSE](https://github.com/d3/d3/blob/master/LICENSE)): [https://d3js.org/](https://d3js.org/)
- Popper ([LICENSE](https://github.com/popperjs/popper-core/blob/master/LICENSE.md)): [https://popper.js.org/](https://popper.js.org/)
- Tippy.js ([LICENSE](https://github.com/atomiks/tippyjs/blob/master/LICENSE)): [https://atomiks.github.io/tippyjs/](https://atomiks.github.io/tippyjs/)
- FontAwesome Icons ([LICENSE](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt)): [https://fontawesome.com/](https://fontawesome.com/)
- favicon.io ([LICENSE](https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS)): [https://favicon.io](https://favicon.io/emoji-favicons/lungs/)
