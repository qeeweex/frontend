document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчик события paste для всего документа
    document.addEventListener('paste', function(event) {
      // Проверяем, есть ли в буфере обмена изображения
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;

      let hasImage = false;

      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          hasImage = true;

          // Получаем файл из буфера обмена
          const blob = item.getAsFile();

          // Создаем уникальное имя для изображения
          const fileName = 'pasted-image-' + new Date().getTime() + '.png';

          // Создаем File объект из Blob
          const file = new File([blob], fileName, { type: blob.type });

          // Добавляем файл в массив выбранных файлов
          selectedFiles.push(file);

          // Обновляем счетчик файлов
          document.getElementById('file-count').textContent = selectedFiles.length;

          // Обновляем отображение списка файлов
          renderFileList();

          // Показываем уведомление о успешной вставке
          showNotification('Изображение вставлено из буфера обмена');
        }
      }

      // Если в буфере обмена есть изображение, показываем секцию с файлами
      if (hasImage && document.querySelector('.uploaded-files')) {
        document.querySelector('.uploaded-files').style.display = 'block';
      }
    });
  });

  // Функция для отображения всплывающего уведомления
  function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'paste-notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    // Добавляем стили
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--primary, #4CAF50)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '8px';
    notification.style.animation = 'fadeIn 0.3s';

    // Добавляем на страницу
    document.body.appendChild(notification);

    // Удаляем через 3 секунды
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Добавляем нужную анимацию в стили
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(20px); }
  }
`;
  document.head.appendChild(styleSheet);
  document.addEventListener('DOMContentLoaded', function() {
    // Create particles for background effect (your existing code)
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 5 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const animDuration = Math.random() * 10 + 10;
      const animDelay = Math.random() * 5;

      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = posX + '%';
      particle.style.top = posY + '%';
      particle.style.animation = `float ${animDuration}s ease-in-out ${animDelay}s infinite, pulse 4s ease-in-out infinite`;

      particlesContainer.appendChild(particle);
    }

    // Initialize SimpleMDE Markdown editor
    const simplemde = new SimpleMDE({
      element: document.getElementById('content'),
      spellChecker: false,
      autosave: {
        enabled: true,
        uniqueId: 'varnix-post-editor',
        delay: 1000,
      },
      placeholder: "Share your thoughts, code, ideas, or questions with the community...",
      toolbar: [
        "bold", "italic", "strikethrough", "|",
        "heading-1", "heading-2", "heading-3", "|",
        "code", "quote", "unordered-list", "ordered-list", "|",
        "link", "image", "table", "horizontal-rule", "|",
        {
          name: "highlight",
          action: function customFunction(editor) {
            const cm = editor.codemirror;
            const selection = cm.getSelection();
            cm.replaceSelection(`==${selection}==`);
          },
          className: "fa fa-highlighter",
          title: "Highlight Text",
        },
        {
          name: "underline",
          action: function customFunction(editor) {
            const cm = editor.codemirror;
            const selection = cm.getSelection();
            cm.replaceSelection(`<u>${selection}</u>`);
          },
          className: "fa fa-underline",
          title: "Underline",
        },
        {
          name: "color",
          action: function customFunction(editor) {
            toggleColorPicker(editor);
          },
          className: "fa fa-palette",
          title: "Text Color",
        },
        {
          name: "codeblock",
          action: function customFunction(editor) {
            const cm = editor.codemirror;
            const selection = cm.getSelection();
            const languagePrompt = document.createElement('div');
            languagePrompt.className = 'language-prompt';
            languagePrompt.innerHTML = `
      <div class="language-prompt-header">Select Language</div>
      <div class="language-buttons">
        <button data-lang="js">JavaScript</button>
        <button data-lang="python">Python</button>
        <button data-lang="java">Java</button>
        <button data-lang="html">HTML</button>
        <button data-lang="css">CSS</button>
        <button data-lang="sql">SQL</button>
        <button data-lang="c">C</button>
        <button data-lang="cpp">C++</button>
        <button data-lang="csharp">C#</button>
        <button data-lang="php">PHP</button>
        <button data-lang="">Plain Text</button>
      </div>
      <div class="language-prompt-custom">
        <input type="text" id="custom-language" placeholder="Or type language name...">
        <button id="use-custom-language">Use</button>
      </div>
    `;

            document.body.appendChild(languagePrompt);

            // Стили для окна выбора языка
            const style = document.createElement('style');
            style.textContent = `
      .language-prompt {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        background-color: #2d2d2d;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
        color: #e0e0e0;
        width: 350px;
        max-width: 90vw;
      }
      .language-prompt-header {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        text-align: center;
      }
      .language-buttons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 15px;
      }
      .language-buttons button {
        background: #3d3d3d;
        border: none;
        color: #e0e0e0;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .language-buttons button:hover {
        background: var(--primary);
        color: white;
      }
      .language-prompt-custom {
        display: flex;
        gap: 8px;
      }
      .language-prompt-custom input {
        flex-grow: 1;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #555;
        background: #3d3d3d;
        color: #e0e0e0;
      }
      .language-prompt-custom button {
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        background: var(--primary);
        color: white;
        cursor: pointer;
      }
    `;
            document.head.appendChild(style);

            // Функция для вставки блока кода с выбранным языком
            function insertCodeWithLanguage(lang) {
              cm.replaceSelection(
                      "```" + lang + "\n" + selection + "\n```"
              );
              // Удаляем окно выбора языка
              document.body.removeChild(languagePrompt);
              document.head.removeChild(style);
            }

            // Обработчики кнопок
            const buttons = languagePrompt.querySelectorAll('.language-buttons button');
            buttons.forEach(btn => {
              btn.addEventListener('click', function() {
                insertCodeWithLanguage(this.dataset.lang);
              });
            });

            // Обработчик кастомного ввода
            document.getElementById('use-custom-language').addEventListener('click', function() {
              const customLang = document.getElementById('custom-language').value.trim();
              insertCodeWithLanguage(customLang);
            });

            // Закрытие окна при клике вне его
            document.addEventListener('click', function closePrompt(e) {
              // Добавление проверки, чтобы игнорировать событие, которое создало диалог
              if (e.isTrusted && !languagePrompt.contains(e.target) &&
                      !e.target.classList.contains('fa-code') &&
                      !e.target.parentElement.classList.contains('fa-code')) {
                document.body.removeChild(languagePrompt);
                document.head.removeChild(style);
                document.removeEventListener('click', closePrompt);
              }
            }, { capture: true, once: false });

            // Предотвратить немедленное закрытие диалога
            setTimeout(() => {
              languagePrompt.style.display = 'block';
            }, 100);
          },
          className: "fa fa-code",
          title: "Code Block with Language",
        },
        {
          name: "help",
          action: function customFunction(editor) {
            const helpSection = document.getElementById('formatting-help');
            if (helpSection.style.display === 'none') {
              helpSection.style.display = 'block';
            } else {
              helpSection.style.display = 'none';
            }
          },
          className: "fa fa-question-circle",
          title: "Formatting Help",
        },
        "preview", "side-by-side", "fullscreen"
      ],
      previewRender: function(plainText, preview) {
        // Here you could add custom rendering for your special syntax
        // For example, handle custom color syntax
        let processedText = plainText;

        // Process custom highlight syntax
        processedText = processedText.replace(/==(.*?)==/g, '<mark>$1</mark>');

        // Process custom color syntax (if you add it)
        processedText = processedText.replace(/\{\{color:([^}]+)\}\}(.*?)\{\{\/color\}\}/g,
                '<span style="color:$1">$2</span>');

        // Return rendered HTML
        setTimeout(function() {
          preview.innerHTML = this.parent.markdown(processedText);
        }.bind(this), 0);

        return "Loading...";
      },
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
      }
    });

    // Update character count when editor changes
    simplemde.codemirror.on("change", function() {
      document.getElementById('content-length').textContent = simplemde.value().length;
    });

// Добавьте следующий код при инициализации SimpleMDE
    simplemde.toolbar[19].action = function() { // Индекс кнопки preview
      simplemde.togglePreview();
      setTimeout(enhanceCodeBlocks, 100); // Запустить после отрисовки превью
    };

    // Create color picker dropdown
    createColorPicker();
  });

  // Create color picker
  function createColorPicker() {
    const toolbarRight = document.querySelector('.editor-toolbar');

    // Create container for color picker dropdown
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.className = 'color-picker-container';
    colorPickerContainer.style.display = 'none'; // Initially hidden, will be shown when needed

    // Create the dropdown
    const colorPickerDropdown = document.createElement('div');
    colorPickerDropdown.className = 'color-picker-dropdown';

    // Add color swatches
    const colors = [
      '#FF5D5D', '#FF8C5D', '#FFBD5D', '#FFE45D', '#D6FF5D',
      '#8CFF5D', '#5DFF8C', '#5DFFBD', '#5DFFF7', '#5DD4FF',
      '#5D8CFF', '#5D5DFF', '#8C5DFF', '#BD5DFF', '#FF5DFF',
      '#FF5DBD', '#FFFFFF', '#CCCCCC', '#999999', '#666666'
    ];

    colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      swatch.dataset.color = color;
      swatch.addEventListener('click', function() {
        applyColorToSelection(this.dataset.color);
      });
      colorPickerDropdown.appendChild(swatch);
    });

    colorPickerContainer.appendChild(colorPickerDropdown);
    document.body.appendChild(colorPickerContainer);

    window.colorPickerContainer = colorPickerContainer;
  }

  // Toggle color picker dropdown
  function toggleColorPicker(editor) {
    const container = window.colorPickerContainer;
    const dropdown = container.querySelector('.color-picker-dropdown');
    container.style.display = 'block';

    // Position the dropdown near the color button
    const colorButton = document.querySelector('.fa-palette').parentElement;
    const rect = colorButton.getBoundingClientRect();

    container.style.position = 'absolute';
    container.style.top = `${rect.bottom + window.scrollY}px`;
    container.style.left = `${rect.left + window.scrollX}px`;

    // Toggle the dropdown
    if (dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      setTimeout(() => {
        container.style.display = 'none';
      }, 300);
    } else {
      dropdown.classList.add('active');

      // Store editor reference for applying color
      window.currentEditor = editor;
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
      if (!dropdown.contains(e.target) && e.target !== colorButton) {
        dropdown.classList.remove('active');
        setTimeout(() => {
          container.style.display = 'none';
        }, 300);
        document.removeEventListener('click', closeDropdown);
      }
    });
  }

  // Apply color to selected text
  function applyColorToSelection(color) {
    const editor = window.currentEditor;
    if (editor) {
      const cm = editor.codemirror;
      const selection = cm.getSelection();
      cm.replaceSelection(`{{color:${color}}}${selection}{{/color}}`);

      // Close the dropdown
      const dropdown = window.colorPickerContainer.querySelector('.color-picker-dropdown');
      dropdown.classList.remove('active');
      setTimeout(() => {
        window.colorPickerContainer.style.display = 'none';
      }, 300);
    }
  }

  // Array to store selected files
  let selectedFiles = [];

  // File upload handling
  function updateFileList(event) {
    const fileInput = event.target;
    const fileList = document.getElementById('file-list');
    const fileCountSpan = document.getElementById('file-count');
    const newFiles = Array.from(fileInput.files);

    // Add new files to the array
    selectedFiles = selectedFiles.concat(newFiles);

    // Update file counter
    fileCountSpan.textContent = selectedFiles.length;

    // Clear the input to allow selecting the same file again
    fileInput.value = '';

    // Refresh the file preview display
    renderFileList();
  }

  function renderFileList() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = ''; // Clear previous list

    selectedFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';

      // Create file preview
      const fileURL = URL.createObjectURL(file);
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = fileURL;
        fileItem.appendChild(img);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = fileURL;
        video.controls = true;
        fileItem.appendChild(video);
      }

      // Add file info
      const fileInfo = document.createElement('div');
      fileInfo.className = 'file-info';
      fileInfo.textContent = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
      fileItem.appendChild(fileInfo);

      // Add remove button
      const removeBtn = document.createElement('div');
      removeBtn.className = 'file-remove';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.onclick = function(e) {
        e.stopPropagation();
        removeFile(index);
      };
      fileItem.appendChild(removeBtn);

      fileList.appendChild(fileItem);
    });
  }

  function removeFile(index) {
    // Remove file from array
    selectedFiles.splice(index, 1);

    // Update file counter
    document.getElementById('file-count').textContent = selectedFiles.length;

    // Refresh display
    renderFileList();
  }

  function addFileInput() {
    const input = document.getElementById('media');
    input.click(); // Open file selection dialog
  }

  // Prepare files for form submission
  function prepareFormSubmission(event) {
    const mediaInput = document.getElementById('media');
    const form = event.target;

    // Get the content from SimpleMDE editor
    const editorContent = document.querySelector('.CodeMirror').CodeMirror.getValue();
    document.getElementById('content').value = editorContent;

    // Clear any existing DataTransfer object
    mediaInput.files = new DataTransfer().files;

    // Create a new DataTransfer object and add all selected files
    if (selectedFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach(file => dataTransfer.items.add(file));
      mediaInput.files = dataTransfer.files;
    }

    // Form continues submission normally
    return true;
  }
  function enhanceCodeBlocks() {
    // Найти все блоки кода
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock, index) => {
      // Получить родительский элемент pre
      const preBlock = codeBlock.parentElement;

      // Определить язык из класса
      let language = 'plaintext';
      const classNames = codeBlock.className.split(' ');
      for (const className of classNames) {
        if (className.startsWith('language-')) {
          language = className.replace('language-', '');
          break;
        }
      }

      // Создать верхнюю панель
      const header = document.createElement('div');
      header.className = 'code-header';

      // Добавить название языка
      const langLabel = document.createElement('span');
      langLabel.className = 'code-language';
      langLabel.textContent = language !== 'plaintext' ? language : 'TEXT';
      header.appendChild(langLabel);

      // Добавить кнопку копирования
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-btn';
      copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
      copyButton.dataset.codeId = `code-${index}`;
      copyButton.onclick = function() {
        copyCodeToClipboard(this);
      };
      header.appendChild(copyButton);

      // Вставить панель перед блоком кода
      preBlock.insertBefore(header, codeBlock);

      // Добавить уникальный ID
      codeBlock.id = `code-${index}`;
    });
  }

  // Функция для копирования кода
  function copyCodeToClipboard(button) {
    const codeId = button.dataset.codeId;
    const codeBlock = document.getElementById(codeId);
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
      // Изменить текст кнопки на короткое время
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copied!';
      button.style.color = '#8CFF5D';

      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }

  // Вызов функции после загрузки DOM
  document.addEventListener('DOMContentLoaded', function() {
    // Существующий код инициализации

    // Добавляем обработку блоков кода
    setTimeout(enhanceCodeBlocks, 500); // Небольшая задержка, чтобы убедиться, что Prism закончил работу
  });