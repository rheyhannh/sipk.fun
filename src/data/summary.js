const getUserIpk = (matkul) => {
  if (!matkul.error) {
    const totalSks = getUserSks(matkul);
    const { totalNilaiAkhir } = matkul.reduce((sum, current) => {
      return {
        totalNilaiAkhir: sum.totalNilaiAkhir + current.nilai_akhir
      };
    }, { totalNilaiAkhir: 0 }
    );
    return (totalNilaiAkhir / totalSks).toFixed(2);
  }

  return -1
}

const getUserIpkPercentage = (user, matkul) => {
  if (user) {
    const ipk = getUserIpk(matkul);
    const ipkTarget = user?.ipk_target || null;
  
    if (ipkTarget) { return Math.round((ipk / ipkTarget) * 100) }
    else { return Math.round((ipk / 4) * 100) }
  } 

  return -1
}

const getUserSks = (matkul) => {
  if (!matkul.error) {
    const { totalSks } = matkul.reduce((sum, current) => {
      return {
        totalSks: sum.totalSks + current.sks,
      };
    }, { totalSks: 0 }
    );
    return totalSks;
  }

  return -1
}

const getUserSksPercentage = (user, matkul) => {
  if (user) {
    const sks = getUserSks(matkul);
    const sksMaks = user?.sks_maks || null;
  
    if (sksMaks) { return Math.round((sks / sksMaks) * 100) }
    else { return Math.round((sks / 144) * 100) }
  }

  return -1
}

const getUserMatkul = (matkul) => {
  if (!matkul.error) {
    return matkul.length
  }

  return -1
}

const getUserMatkulPercentage = () => {
  return 100
}

module.exports = {
  getUserIpk,
  getUserIpkPercentage,
  getUserMatkul,
  getUserMatkulPercentage,
  getUserSks,
  getUserSksPercentage
}