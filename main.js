if (typeof window !== 'undefined') {
  window.plugins = window.plugins || {};
  
  window.plugins['com.andres.multilinter'] = {
    async init(baseUrl, $page, options) {
      // Notificación inicial de que tu sistema propio está activo
      acode.alert("MultiLinter", "¡Tu sistema multilenguaje está en línea y vigilando el código!");

      let debounceTimer = null;

      // Escuchamos cada cambio con un pequeño retraso para no saturar el celular
      editorManager.editor.on('change', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const session = editorManager.editor.getSession();
          const code = session.getValue();
          const activeFile = editorManager.activeFile;

          if (!activeFile) return;

          const fileName = activeFile.name.toLowerCase();

          // Enrutador de lenguajes de tu sistema
          if (fileName.endsWith('.cpp') || fileName.endsWith('.h') || fileName.endsWith('.ino')) {
            this.analizarCplusplus(code);
          } else if (fileName.endsWith('.py')) {
            this.analizarPython(code);
          } else if (fileName.endsWith('.js') || fileName.endsWith('.ts')) {
            this.analizarJavascript(code);
          }
        }, 800); // Espera 800ms después de que dejes de escribir para analizar
      });
    },

    analizarCplusplus(code) {
      const lines = code.split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.length > 0 && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.startsWith('#') && !trimmed.startsWith('//')) {
          console.log(`[C++] Posible error en línea ${index + 1}: Falta ';'`);
        }
      });
    },

    analizarPython(code) {
      const lines = code.split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if ((trimmed.startsWith('if ') || trimmed.startsWith('for ') || trimmed.startsWith('def ')) && !trimmed.endsWith(':')) {
          console.log(`[Python] Posible error en línea ${index + 1}: Falta ':'`);
        }
      });
    },

    analizarJavascript(code) {
      const lines = code.split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.includes('var ')) {
          console.log(`[JS] Sugerencia en línea ${index + 1}: Se recomienda usar 'let' o 'const'.`);
        }
      });
    },

    async destroy() {
      acode.alert("MultiLinter", "Tu sistema ha sido desactivado.");
    }
  };
}
