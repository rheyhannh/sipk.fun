/*
============================== CODE START HERE ==============================
*/
const getUserIpk = (matkul) => {
  if (matkul) {
    const totalSks = getUserSks(matkul);
    const { totalNilaiAkhir } = matkul.reduce((sum, current) => {
      return {
        totalNilaiAkhir: sum.totalNilaiAkhir + current.nilai.akhir
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
    const ipkPercentage = ipkTarget ? Math.round((ipk / ipkTarget) * 100) : Math.round((ipk / 4) * 100);

    return ipkPercentage > 100 ? 100 : ipkPercentage
  }

  return -1
}

const getUserSks = (matkul) => {
  if (matkul) {
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
    const sksTarget = user?.sks_target || null;
    const sksPercentage = sksTarget ? Math.round((sks / sksTarget) * 100) : Math.round((sks / 144) * 100);  

    return sksPercentage > 100 ? 100 : sksPercentage
  }

  return -1
}

const getUserMatkul = (matkul) => {
  if (matkul) {
    return matkul.length
  }

  return -1
}

const getUserMatkulPercentage = (user, matkul) => {
  if (user) {
    const matkulTotal = matkul.length;
    const matkulTarget = user?.matkul_target || null;
    const matkulPercentage = matkulTarget ? Math.round((matkulTotal / matkulTarget) * 100) : Math.round((matkulTotal / 50) * 100)

    return matkulPercentage > 100 ? 100 : matkulPercentage
  }

  return -1
}

module.exports = {
  getUserIpk,
  getUserIpkPercentage,
  getUserMatkul,
  getUserMatkulPercentage,
  getUserSks,
  getUserSksPercentage
}