let uploadedFile = null;

function initFileUploader() {
  const inputElement = document.querySelector('input.filepond[type="file"]');
  if (!inputElement) return;

  // First register any plugins
  FilePond.registerPlugin(FilePondPluginFileValidateType);
  FilePond.registerPlugin(FilePondPluginImagePreview);

  const pond = FilePond.create(inputElement);

  pond.on('error', e => {
    console.log('File added', e.detail);
  });

  pond.on('removefile', (error, file) => {
    uploadedFile = null;
  });

  pond.on('processfilestart', (error, file) => {
    uploadedFile = {
      done: false,
    };
  });

  pond.on('processfile', (error, file) => {
    uploadedFile = {
      path: file.serverId + '.' + file.fileExtension,
      name: file.serverId.split('/').pop(),
      type: file.fileType,
      extension: file.fileExtension,
      size: file.fileSize,
      done: true,
    };
  });

  const filepondPlaceholder = `
        <p class="text-center cursor-pointer">
            <svg viewBox="0 0 49 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto 20px; color: rgb(22, 24, 35); opacity: 0.32; width: 49px; height: 36px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M34.8955 4.29545C32.0286 1.42335 28.2592 0 24.5 0C20.7408 0 16.9866 1.42497 14.1215 4.29545C11.1029 7.31969 9.74283 11.3547 9.90208 15.3239C4.39933 15.5606 0 20.0653 0 25.6364C0 31.3589 4.63246 36 10.3444 36H23.78C23.779 35.9769 23.7786 35.9537 23.7786 35.9304V20.0971L20.2795 23.2099C19.7096 23.7658 18.7372 23.6954 18.1919 23.1118C17.6266 22.5069 17.7322 21.4321 18.3066 20.8814L24.2603 15.3912C24.5835 15.0757 24.8571 14.9977 25.2467 14.999C25.6394 15.0069 26.0234 15.1859 26.2332 15.3912L32.1868 20.8814C32.7902 21.4425 32.8195 22.5005 32.3015 23.1118C31.7835 23.723 30.7839 23.7658 30.2139 23.2099L26.7149 20.0971V35.9304C26.7149 35.9537 26.7144 35.9769 26.7135 36H37.0222C43.6244 36 49 30.6145 49 24C49 18.0445 44.6375 13.1309 38.9448 12.2045C38.4457 9.31312 37.1202 6.52435 34.8955 4.29545Z" fill="currentColor"></path></svg>
        </p>
        <p class="m-0 cursor-pointer"> Ընտրեք նկար վերբեռնելու համար </p>
        <p class="m-0 cursor-pointer"> կամ մկնիկով սահեցրեք այստեղ </p>
    `;

  FilePond.setOptions({
    labelIdle: filepondPlaceholder,
    acceptedFileTypes: ['image/*'],
    chunkUploads: true,
    chunkForce: true,
    maxFiles: 3,
    maxChunkSize: 50000,
    server: {
      url: '/media/upload',
      process: {
        headers: {
          'Gallery': 'teachers',
        },
      },
    },
  });

  $('[data-init=afterFilepond]').fadeIn('fast');
}

$(function() {

  initFileUploader();

  $('#avatarTrigger').click(function() {
    $('#uploadModal').removeClass('hidden');
  });

  $('#uploadModal [data-action=dismiss]').click(function() {
    $('#uploadModal').addClass('hidden');
  });

  $('#uploadModal [data-action=confirm]').click(function() {
    $('#uploadModal').addClass('hidden');

    if (!uploadedFile) return;

    $('#avatarTrigger .image-wrapper').removeClass('hidden');
    $('#avatarTrigger .image-wrapper img').attr('src', '/st/media/' + uploadedFile.path);

    $('[name=avatar]').val(uploadedFile.path);
  });

  $('.dismiss-avatar').click(function(e) {
    e.stopPropagation();
    $('#avatarTrigger .image-wrapper').addClass('hidden');
  });
});