# Markdown EPUB builder

## Configuration

The book configuration is defined in a YAML file. Here's an explanation of the available options:

| Field       | Type     | Required | Description                                           |
|-------------|----------|----------|-------------------------------------------------------|
| title       | string   | Yes      | The title of the book                                 |
| author      | string   | Yes      | The author of the book                                |
| description | string   | No       | A description of the book                             |
| books       | string[] | Yes      | An array of file paths containing the book content    |
|             |          |          | (Must contain at least one item)                      |
| cssFile     | string   | No       | The path to the CSS file for styling                  |
| fonts       | string[] | No       | An array of font file paths                           |
| cover       | string   | No       | The path to the cover image file                      |
| output      | string   | Yes      | The output path for the generated ebook file          |

### Example Configuration

```yaml
title: 소나기
author: 황순원
description: 1952년 《신문학》지에 처음 발표되어 현재까지 사랑받고 있는 황순원 집필의 단편소설.
books:
  - resources/body/example/01.md
cssFile: resources/css/styles.css
fonts:
  - resources/fonts/KOPUSGoB.ttf
  - resources/fonts/KOPUSGoL.ttf
  - resources/fonts/KOPUSMjB.ttf
  - resources/fonts/KOPUSMjL.ttf
  - resources/fonts/NanumMyeongjo.ttf
cover: resources/images/cover.jpg
output: public/book.epub
```

Make sure to include all required fields (title, author, books, output) in your configuration. The `books` array must contain at least one file path. Other fields are optional but can be used to customize your ebook's appearance and content.